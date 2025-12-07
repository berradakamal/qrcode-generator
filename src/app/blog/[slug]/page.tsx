"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { postsApi, type Post } from '@/lib/api';
import { PostContent } from '@/components/blog/PostContent';
import { Navigation } from '@/components/landing/Navigation';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await postsApi.get(slug);
        setPost(data.post);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32">
        {loading ? (
          <div className="max-w-4xl mx-auto animate-pulse space-y-6">
            <div className="h-4 bg-slate-200 rounded w-24" />
            <div className="h-12 bg-slate-200 rounded w-3/4" />
            <div className="h-6 bg-slate-200 rounded w-1/2" />
            <div className="h-4 bg-slate-200 rounded w-48" />
            <div className="h-96 bg-slate-200 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Post not found</h1>
            <p className="text-slate-600 mb-6">{error}</p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-blue-600 hover:underline"
            >
              ← Back to Blog
            </Link>
          </div>
        ) : post ? (
          <PostContent post={post} />
        ) : null}
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} QRCode Generator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
