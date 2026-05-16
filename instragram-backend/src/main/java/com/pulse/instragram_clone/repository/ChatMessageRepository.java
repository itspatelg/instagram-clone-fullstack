package com.pulse.instragram_clone.repository;

import com.pulse.instragram_clone.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    // Ye methods do users ke beech ki chat history nikalne ke liye hain
    List<ChatMessage> findBySenderEmailAndReceiverEmailOrderByTimestampAsc(String sender, String receiver);
    List<ChatMessage> findByReceiverEmailAndSenderEmailOrderByTimestampAsc(String receiver, String sender);
}
