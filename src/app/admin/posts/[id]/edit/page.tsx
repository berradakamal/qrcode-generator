"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { PostForm } from '@/components/admin/PostForm';
import { postsApi, type Post } from '@/lib/api';

const ADMIN_EMAIL = 'berradakam@gmail.com';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const { data: session, status } = useSession();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = session?.user?.email === ADMIN_EMAIL;

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || !isAdmin) {
      router.push('/');
      return;
    }

    const fetchPost = async () => {
      try {
        const data = await postsApi.getById(postId);
        setPost(data.post);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [session, status, isAdmin, router, postId]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!session || !isAdmin) {
    return null;
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-50">
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="QRCode Generator Logo"
                  width={40}
                  height={40}
                />
                <span className="font-extrabold text-xl text-slate-900">
                  QRCode <span className="text-blue-600">Generator</span>
                </span>
              </Link>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Post not found</h1>
            <p className="text-slate-600 mb-6">{error || 'The post you are looking for does not exist.'}</p>
            <Link
              href="/admin/posts"
              className="text-blue-600 hover:underline"
            >
              Back to Posts
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="QRCode Generator Logo"
                width={40}
                height={40}
              />
              <span className="font-extrabold text-xl text-slate-900">
                QRCode <span className="text-blue-600">Generator</span>
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Edit Post</h1>
        <PostForm mode="edit" post={post} />
      </main>
    </div>
  );
}
