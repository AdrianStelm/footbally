'use client';

import { useAuthStore } from "../store/authStore";
import Link from "next/link";
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";

interface Props {
    id: string;
    title: string;
    text: string;
    author: { id: string; username: string };
    createdAt: Date;
    updatedAt: Date;
}

const DELETE_ARTICLE = gql`
  mutation DeleteArticle($id: String!) {
    deleteArticle(id: $id)
  }
`;

const UPDATE_ARTICLE = gql`
  mutation UpdateArticle($id: String!, $data: UpdateArticleInput!) {
    changeArticle(id: $id, data: $data) {
      id
      title
      text
      updatedAt
    }
  }
`;

export function Article(props: Props) {
    const currentUserId = useAuthStore((state) => state.userId);
    const [deleted, setDeleted] = useState(false);
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(props.title);
    const [text, setText] = useState(props.text);

    const [deleteArticle, { loading: deleteLoading }] = useMutation(DELETE_ARTICLE, {
        variables: { id: props.id },
        onCompleted: () => setDeleted(true),
        onError: (err) => alert(err.message),
    });

    const [updateArticle, { loading: updateLoading }] = useMutation(UPDATE_ARTICLE, {
        onCompleted: (data) => {
            setTitle(data.changeArticle.title);
            setText(data.changeArticle.text);
            setEditing(false);
        },
        onError: (err) => alert(err.message),
    });

    const handleDelete = () => {
        if (confirm("Ви впевнені, що хочете видалити статтю?")) {
            deleteArticle();
        }
    };

    const handleUpdate = () => {
        updateArticle({
            variables: { id: props.id, data: { title, text } },
        });
    };

    const formatDate = (date: Date) =>
        date.toLocaleString("uk-UA", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    if (deleted) return null;

    return (
        <div style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
            {editing ? (
                <div>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: "100%", marginBottom: "0.5rem" }}
                    />
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        style={{ width: "100%", minHeight: "100px" }}
                    />
                    <div style={{ marginTop: "0.5rem" }}>
                        <button onClick={handleUpdate} disabled={updateLoading}>
                            {updateLoading ? "Зберігаємо..." : "Зберегти"}
                        </button>
                        <button onClick={() => setEditing(false)} style={{ marginLeft: "0.5rem" }}>
                            Скасувати
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <h1>{title}</h1>
                    <p>{text}</p>
                </div>
            )}

            <small>{props.author.username}</small>
            <br />
            <time>{formatDate(props.createdAt)}</time>
            {props.createdAt.getTime() !== props.updatedAt.getTime() && (
                <time> (оновлено: {formatDate(props.updatedAt)})</time>
            )}

            {props.author.id === currentUserId && !editing && (
                <div style={{ marginTop: "0.5rem" }}>
                    <button onClick={handleDelete} disabled={deleteLoading}>
                        {deleteLoading ? "Видаляємо..." : "Видалити"}
                    </button>
                    <button onClick={() => setEditing(true)} style={{ marginLeft: "0.5rem" }}>
                        Редагувати
                    </button>
                </div>
            )}
        </div>
    );
}
