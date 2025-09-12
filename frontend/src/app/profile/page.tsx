"use client";

import { useMutation, useQuery } from "@apollo/client";
import { useAuthStore } from "../../../store/authStore";
import ArticleCard from "../../../components/Article";
import { ArticleType } from "../../../types/ArticleTypes";
import { useState } from "react";
import { FieldConfig } from "../../../types/formTypes";
import Form from "../../../components/Form";
import { UpdateUserType } from "../../../types/userType";
import { toast } from "sonner";
import { GET_MY_ARTICLES } from "../../../graphql/queries/article/articleQuries";
import { UPDATE_USERNAME, REQUEST_EMAIL_CHANGE, CHANGE_PASSWORD } from "../../../graphql/mutations/user/userMutations";
import { useCheckAuth } from "../../../hooks/useCheckAuth";

const changeEmailField: FieldConfig[] = [
    { name: "newEmail", label: "Input your new email", type: "email", placeholder: "Type here", required: true },
];
const changeUsernameField: FieldConfig[] = [
    { name: "username", label: "Input your new username", type: "text", placeholder: "Type here", required: true },
];
const changePasswordFields: FieldConfig[] = [
    { name: "inputedPassword", label: "Input your new password", type: "password", placeholder: "Type here", required: true },
    { name: "newPassword", label: "Input your current password", type: "password", placeholder: "Type here", required: true },
];





enum ProfileMode {
    Articles = "articles",
    ChangePassword = "changePassword",
    ChangeUsername = "changeUsername",
    ChangeEmail = "changeEmail",
}

export default function ProfilePage() {
    const { initialized } = useAuthStore();
    const [mode, setMode] = useState<ProfileMode>(ProfileMode.Articles);
    const [emailCooldown, setEmailCooldown] = useState(false);
    useCheckAuth();
    const [updateUsername] = useMutation(UPDATE_USERNAME, {
        refetchQueries: [{ query: GET_MY_ARTICLES }],
    });

    const [changePassword] = useMutation(CHANGE_PASSWORD);

    const [requestEmailChange] = useMutation(REQUEST_EMAIL_CHANGE);

    const { data, loading, error } = useQuery(GET_MY_ARTICLES, {
        skip: !initialized
    });

    if (!initialized) return <p>Loading auth...</p>;
    if (loading) return <p>Loading articles...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const items: ArticleType[] = data?.getArticlesByAuthor || [];

    const handleUpdateUsername = async (formData: UpdateUserType) => {
        try {
            await updateUsername({ variables: { data: { username: formData.username } } });
            setMode(ProfileMode.Articles);
        } catch (err) {
            console.error("Update username error:", err);
        }
    };

    const handleChangePassword = async (formData: { inputedPassword: string; newPassword: string }) => {
        try {
            await changePassword({
                variables: {
                    inputedPassword: formData.inputedPassword,
                    newPassword: formData.newPassword,
                },
            });
            toast.success("Password changed successfully");
            setMode(ProfileMode.Articles);
        } catch (err) {
            console.error("Change password error:", err);
        }
    };

    const handleChangeEmail = async (formData: { newEmail: string }) => {
        try {
            await requestEmailChange({
                variables: {
                    newEmail: formData.newEmail,
                },
            });
            toast.success('Letter was sented to your email')
            setMode(ProfileMode.Articles);

            setEmailCooldown(true);
        } catch (err) {
            console.error("Change email error:", err);
        }
    };

    return (
        <section>
            <div className="flex overflow-auto px-5 gap-5 whitespace-nowrap md:gap-5 md:px-10 pb-5">
                <p
                    style={{ color: mode === ProfileMode.Articles ? "#166534" : "" }}
                    className="cursor-pointer"
                    onClick={() => setMode(ProfileMode.Articles)}
                >
                    Your articles
                </p>
                <p
                    style={{ color: mode === ProfileMode.ChangeUsername ? "#166534" : "" }}
                    className="cursor-pointer"
                    onClick={() => setMode(ProfileMode.ChangeUsername)}
                >
                    Change username
                </p>
                <p
                    style={{ color: mode === ProfileMode.ChangePassword ? "#166534" : "" }}
                    className="cursor-pointer"
                    onClick={() => setMode(ProfileMode.ChangePassword)}
                >
                    Change password
                </p>
                <p
                    style={{ color: mode === ProfileMode.ChangeEmail ? "#166534" : "" }}
                    className={`cursor-pointer ${emailCooldown ? "opacity-50 pointer-events-none" : ""}`}
                    onClick={() => setMode(ProfileMode.ChangeEmail)}
                >
                    Change email
                </p>
            </div>
            <hr />

            {mode === ProfileMode.Articles ? (
                <>
                    <h2 className="text-4xl font-bold mx-5">Your profile</h2>
                    <p className="mx-5">{items[0]?.author.username}</p>
                    <h2 className="text-3xl text-center font-bold mt-4">Your articles</h2>
                    <div className="space-y-4 mt-2">
                        {items.length === 0 ? (
                            <p className="text-center text-gray-500">U don`t have any articles</p>
                        ) : (
                            items.map((article) => (
                                <ArticleCard
                                    key={article.id}
                                    id={article.id}
                                    slug={article.slug}
                                    title={article.title}
                                    text={article.text}
                                    author={article.author}
                                    createdAt={article.createdAt}
                                    updatedAt={article.updatedAt}
                                    likesCount={article.likesCount}
                                    content={article.content}
                                />
                            ))
                        )}
                    </div>

                </>
            ) : mode === ProfileMode.ChangeUsername ? (
                <Form fields={changeUsernameField} onSubmit={handleUpdateUsername} buttonText="Change username" />
            ) : mode === ProfileMode.ChangePassword ? (
                <Form fields={changePasswordFields} onSubmit={handleChangePassword} buttonText="Change password" />
            ) : mode === ProfileMode.ChangeEmail ? (
                <Form
                    fields={changeEmailField}
                    onSubmit={handleChangeEmail}
                    buttonText={"Change email"}
                    disabled={emailCooldown}
                />
            ) : null}
        </section>
    );
}
