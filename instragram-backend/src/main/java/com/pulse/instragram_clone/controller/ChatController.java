package com.pulse.instragram_clone.controller;

import com.pulse.instragram_clone.model.ChatMessage;
import com.pulse.instragram_clone.repository.ChatMessageRepository; // Ye import bahut zaruri hai
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    // Real-time message handle karne ke liye
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(ChatMessage chatMessage) {
        // Pehle message database mein save hoga
        chatMessageRepository.save(chatMessage);

        // Phir receiver ko bheja jayega
        messagingTemplate.convertAndSendToUser(
                chatMessage.getReceiverEmail(), "/queue/messages", chatMessage
        );
    }

    // Purani chat history dikhane ke liye endpoint
    @GetMapping("/api/messages/history")
    @ResponseBody
    public List<ChatMessage> getChatHistory(@RequestParam String user1, @RequestParam String user2) {
        List<ChatMessage> messages = new ArrayList<>();

        // Dono taraf ke messages nikaalo
        messages.addAll(chatMessageRepository.findBySenderEmailAndReceiverEmailOrderByTimestampAsc(user1, user2));
        messages.addAll(chatMessageRepository.findByReceiverEmailAndSenderEmailOrderByTimestampAsc(user1, user2));

        // Waqt ke hisab se line mein lagao (Sort)
        messages.sort(Comparator.comparing(ChatMessage::getTimestamp));

        return messages;
    }
}
