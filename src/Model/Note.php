<?php
namespace App\Model;

use App\Service\Config;
use DateTime;

class Note
{
    private ?int $id = null;
    private ?DateTime $createdAt = null;
    private ?string $content = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Note
    {
        $this->id = $id;

        return $this;
    }

    public function getCreatedAt(): ?DateTime
    {
        return $this->createdAt;
    }

    public function getStringCreatedAt(): ?string
    {
        return $this->createdAt ? $this->createdAt->format('Y-m-d') : "";
    }

    public function setCreatedAt(?DateTime $dateTime): Note
    {
        $this->createdAt = $dateTime;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(?string $content): Note
    {
        $this->content = $content;

        return $this;
    }

    public static function fromArray($array): Note
    {
        $note = new self();
        $note->fill($array);

        return $note;
    }

    public function fill($array): Note
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['createdAt'])) {
            $this->setCreatedAt(new DateTime($array['createdAt']));
        }
        if (isset($array['content'])) {
            $this->setContent($array['content']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM note';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $notes = [];
        $notesArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($notesArray as $noteArray) {
            $notes[] = self::fromArray($noteArray);
        }

        return $notes;
    }

    public static function find($id): ?Note
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM note WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $noteArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $noteArray) {
            return null;
        }
        $note = Note::fromArray($noteArray);

        return $note;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getId()) {
            $sql = "INSERT INTO note (createdAt, content) VALUES (:createdAt, :content)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':createdAt' => $this->getCreatedAt()->format('Y-m-d'),
                ':content' => $this->getContent(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE note SET createdAt = :createdAt, content = :content WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':createdAt' => $this->getCreatedAt()->format('Y-m-d'),
                ':content' => $this->getContent(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM note WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setCreatedAt(null);
        $this->setContent(null);
    }
}
