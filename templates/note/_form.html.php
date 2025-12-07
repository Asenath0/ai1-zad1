<?php
    /** @var $note ?\App\Model\Note */
?>

<div class="form-group">
    <label for="createdAt">Date</label>
    <input type="date" id="createdAt" name="note[createdAt]" value="<?= $note ? $note->getStringCreatedAt() : '' ?>">
</div>

<div class="form-group">
    <label for="content">Content</label>
    <textarea id="content" name="note[content]"><?= $note ? $note->getContent() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
