"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { postsApi, getImageUrl, type Post } from '@/lib/api';

export const BlogSection = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postsApi.list();
        setPosts(data.posts.slice(0, 3));
      } catch {
        // Silently fail - blog section is optional
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              Latest from Our Blog
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Tips, tutorials, and insights about QR codes and digital marketing
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-100 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              Latest from Our Blog
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl">
              Tips, tutorials, and insights about QR codes and digital marketing
            </p>
          </div>
          <Link
            href="/blog"
            className="mt-6 md:mt-0 inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
          >
            View all posts
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                {post.coverImage ? (
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={getImageUrl(post.coverImage)}
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white/80 text-6xl font-bold">{post.title[0]}</span>
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                    <span>{post.author.name}</span>
                    {post.publishedAt && (
                      <>
                        <span>•</span>
                        <time dateTime={post.publishedAt}>
                          {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </time>
                      </>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-2 flex-1">{post.excerpt}</p>
                  <div className="mt-4 text-blue-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read more
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
