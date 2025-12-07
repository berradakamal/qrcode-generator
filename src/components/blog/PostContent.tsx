"use client";

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getImageUrl, type Post } from '@/lib/api';

interface PostContentProps {
  post: Post;
}

export const PostContent = ({ post }: PostContentProps) => {
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <article>
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Blog
      </Link>

      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
          {post.title}
        </h1>
        {post.subtitle && (
          <p className="text-xl text-slate-600 mb-6">{post.subtitle}</p>
        )}
        <div className="flex items-center gap-4 text-slate-500">
          <span className="font-medium">{post.author.name}</span>
          {formattedDate && (
            <>
              <span>•</span>
              <time dateTime={post.publishedAt || ''}>{formattedDate}</time>
            </>
          )}
        </div>
      </header>

      {post.coverImage && (
        <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-10">
          <img
            src={getImageUrl(post.coverImage)}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      )}

      <div
        className="prose prose-lg prose-slate max-w-none text-slate-900
          prose-headings:font-bold prose-headings:text-slate-900
          prose-h1:text-4xl prose-h1:mt-10 prose-h1:mb-6
          prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-slate-200
          prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
          prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3
          prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-6
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-slate-900 prose-strong:font-bold
          prose-ul:list-disc prose-ul:my-6 prose-ul:pl-6
          prose-ol:list-decimal prose-ol:my-6 prose-ol:pl-6
          prose-li:text-slate-700 prose-li:mb-2
          prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:my-6 prose-blockquote:italic prose-blockquote:text-slate-600 prose-blockquote:bg-slate-50 prose-blockquote:rounded-r-lg
          prose-code:bg-slate-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:text-slate-800 prose-code:font-mono
          prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-xl prose-pre:my-6
          prose-img:rounded-xl prose-img:my-8
          prose-table:border-collapse prose-table:w-full prose-table:my-8 prose-table:rounded-lg prose-table:overflow-hidden
          prose-th:border prose-th:border-slate-300 prose-th:bg-slate-100 prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-semibold prose-th:text-slate-900
          prose-td:border prose-td:border-slate-300 prose-td:px-4 prose-td:py-3 prose-td:text-slate-700"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
};
