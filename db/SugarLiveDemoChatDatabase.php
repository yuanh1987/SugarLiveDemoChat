<?php

class SugarLiveDemoChatDatabase
{
    private $conn;

    public function __construct()
    {
        // DB connect
        $this->conn = new PDO($_ENV['DATABASE_DSN'], $_ENV['DATABASE_USER'], $_ENV['DATABASE_PASSWORD']);
        $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    public function select($chat = null){
        $statement = $this->conn->prepare('SELECT contact_id,created_at FROM chat WHERE contact_agent = ?');
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->execute([$chat->agent]);
        $rez = $statement->fetchAll();

        return $rez;
    }

    public function insert($chat = null){
        $statement = $this->conn->prepare('INSERT into chat (contact_agent, contact_id, participant_id) 
                        VALUES (?, ?, ?)');
        $statement->execute([$chat->agent, $chat->id, $chat->participant_id]);
    }

    public function delete($chat = null){
        $params[] = $chat->agent;
        $sql = 'DELETE from chat where contact_agent=?';

        // Delete only specific record if we have a contact_id
        if (isset($chat->contact_id)) {
            $params[] = $chat->contact_id;
            $sql .= ' AND contact_id=?';
        }

        $statement = $this->conn->prepare($sql);
        $statement->execute($params);
    }

    public function __destruct() {
        $this->conn = null;
    }
}