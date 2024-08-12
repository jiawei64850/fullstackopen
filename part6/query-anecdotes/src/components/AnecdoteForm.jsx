import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createNew } from "../request";
import { useContext } from "react";
import NotificationContext from "../notificationContext";

const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const [notification, dispatchNotification] = useContext(NotificationContext);

  const newAnecdoteMutation = useMutation({
    mutationFn: createNew,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      queryClient.setQueryData(["anecdotes"], anecdotes.concat(newAnecdote));
    },
    onError: (error) => {
      console.error("Error adding anecdote:", error);
      dispatchNotification({ type: "CLEAR" });
      dispatchNotification({
        type: "ERROR",
        payload: "too short anecdote, must have length 5 or more",
      });
      setTimeout(() => {
        dispatchNotification({ type: "CLEAR" });
      }, 5000);
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    dispatchNotification({ type: "CLEAR" });
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    console.log("new anecdote");
    newAnecdoteMutation.mutate({ content, votes: 0 });
    dispatchNotification({ type: "CREATE", payload: content });
    setTimeout(() => {
      dispatchNotification({ type: "CLEAR" });
    }, 5000);
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
