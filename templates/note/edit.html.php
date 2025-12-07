<?php

/** @var \App\Model\Note $note */
/** @var \App\Service\Router $router */

$title = "Edit note from {$note->getStringCreatedAt()} ({$note->getId()})";
$bodyClass = "edit";

ob_start(); ?>
    <h1><?= $title ?></h1>
    <form action="<?= $router->generatePath('note-edit') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="note-edit">
        <input type="hidden" name="id" value="<?= $note->getId() ?>">
    </form>

    <ul class="action-list">
        <li>
            <a href="<?= $router->generatePath('note-index') ?>">Back to list</a></li>
        <li>
            <form action="<?= $router->generatePath('note-delete') ?>" method="post">
                <input type="submit" value="Delete" onclick="return confirm('Are you sure?')">
                <input type="hidden" name="action" value="note-delete">
                <input type="hidden" name="id" value="<?= $note->getId() ?>">
            </form>
        </li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
