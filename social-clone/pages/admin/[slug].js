import AuthCheck from '../../components/AuthCheck';
import { firestore, auth, serverTimestamp } from '../../lib/firebase';
import ImageUploader from '../../components/ImageUploader';

import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminPostEdit(props) {
    return (
        <AuthCheck>
            <PostManager />
        </AuthCheck>
    )
}

function PostManager() {
    const [preview, setPreview] = useState(false);

    const router = useRouter();

    const { slug } = router.query;

    const postRef = firestore.collection('users').doc(auth.currentUser.uid).collection('posts').doc(slug);

    const [post] = useDocumentData(postRef);

    return (
        <main className='w-full min-h-96 grid grid-cols-1 place-items-center'>
            {post && (
                <div className='w-full flex flex-col place-items-center'>
                    <section>
                        <span className='text-2xl'>{post.title}</span>
                        <PostForm postRef={postRef} defaultValues={post} preview={preview} />
                    </section>
                    <div className='w-full flex flex-col place-items-center'>
                        <h3 className='text-bolder text-2xl mb-2 mt-2'>Tools</h3>
                        <div className='flex flex-row gap-4'>
                            <button className='px-4 py-1 rounded-lg bg-indigo-500 text-white shadow-sm' onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
                            <Link href={`/${post.username}/${post.slug}`}>
                                <button className='px-4 py-1 rounded-lg bg-indigo-500 text-white shadow-sm'>Live view</button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </main>

    );
}

function PostForm({ defaultValues, postRef, preview }) {
    const { register, handleSubmit, reset, watch, formState: { errors }} = useForm({ defaultValues, mode: 'onChange' });

    const { isValid, isDirty } = errors;



    const updatePost = async ({ content, published }) => {
        await postRef.update({
            content,
            published,
            updatedAt: serverTimestamp(),
        });

        reset({ content, published });

        toast.success('Post updated!');
    }

    return (
        <form className='w-full bg-slate-50 border rounded-lg border-indigo-500 p-2' onSubmit={handleSubmit(updatePost)}>
            {preview && (
                <div>
                    <ReactMarkdown>{watch('content')}</ReactMarkdown>
                </div>
            )}

            <div className={preview ? "hidden" : "visible"}>
                <div className='w-full min-h-96 mx-auto flex flex-col gap-2 place-items-center'>

                    <ImageUploader />

                    <textarea className='w-full h-full' name="content" {...register("content",{
                        maxLength: { value: 20000, message: "content is too long"},
                        minLength: { value: 10, message: 'content is too short'},
                        required: { value: true, message: 'content is required'},
                    })}></textarea>

                    {errors.content && <p>{errors.content.message}</p>}

                    <fieldset className='flex flex-row gap-2'>
                        <input name="published" type="checkbox" {...register('published')} />
                        <label>Published</label>
                    </fieldset>

                    <button className='px-4 py-2 bg-green-500 rounded-lg text-white' type="submit" disabled={!errors}>
                        Save Changes
                    </button>
                </div>
            </div>
        </form>
    );
}