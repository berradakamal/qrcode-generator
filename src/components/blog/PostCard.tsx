"use client";

import Link from 'next/link';
import { getImageUrl, type Post } from '@/lib/api';

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {post.coverImage && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={getImageUrl(post.coverImage)}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
            <span>{post.author.name}</span>
            {formattedDate && (
              <>
                <span>•</span>
                <time dateTime={post.publishedAt || ''}>{formattedDate}</time>
              </>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h2>
          {post.subtitle && (
            <p className="text-slate-600 mb-3 line-clamp-1">{post.subtitle}</p>
          )}
          <p className="text-slate-500 text-sm line-clamp-3">{post.excerpt}</p>
          <div className="mt-4 text-blue-600 font-semibold text-sm group-hover:underline">
            Read more →
          </div>
        </div>
      </article>
    </Link>
  );
};
