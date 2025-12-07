<?php

/** @var \App\Model\Note[] $notes */
/** @var \App\Service\Router $router */

$title = 'Note List';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Notes List</h1>

    <a href="<?= $router->generatePath('note-create') ?>">Create new</a>

    <ul class="index-list">
        <?php foreach ($notes as $note): ?>
            <li><h3><?= $note->getStringCreatedAt() ?></h3>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('note-show', ['id' => $note->getId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('note-edit', ['id' => $note->getId()]) ?>">Edit</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
