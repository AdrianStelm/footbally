// Article.tsx
interface Props {
    id: string;
    title: string;
    text: string;
    author: { username: string };
    createdAt: Date;
    updatedAt: Date;
}

export function Article(props: Props) {
    const formatDate = (date: Date) =>
        date.toLocaleString("uk-UA", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    return (
        <div key={props.id}>
            <h1>{props.title}</h1>
            <p>{props.text}</p>
            <small>{props.author.username}</small>
            <time>{formatDate(props.createdAt)}</time>
            {props.createdAt.getTime() !== props.updatedAt.getTime() && (
                <time> (оновлено: {formatDate(props.updatedAt)})</time>
            )}
        </div>
    );
}
