import SockJS from "sockjs-client";
import Stomp from "stompjs";

let stompClient = null;

export const connectSocket = (roomId, onMessageReceived) => {
  const socket = new SockJS("http://localhost:8080/ws");
  stompClient = Stomp.over(socket);

  const token = localStorage.getItem("jwt");

  stompClient.connect(
    {
      Authorization: `Bearer ${token}`,
    },
    () => {
      console.log("Connected to WebSocket");

      stompClient.subscribe(`/topic/room/${roomId}`, (message) => {
        const body = JSON.parse(message.body);
        onMessageReceived(body);
      });
    },
    (error) => {
      console.error("WebSocket connection error:", error);
    },
  );
};

export const sendMessage = (roomId, messageData) => {
  if (stompClient && stompClient.connected) {
    stompClient.send(
      `/app/chat.sendMessage/${roomId}`,
      {},
      JSON.stringify(messageData),
    );
  }
};

export const disconnectSocket = () => {
  if (stompClient) {
    stompClient.disconnect(() => {
      console.log("Disconnected from WebSocket");
    });
  }
};
