"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Eye, ArrowLeft, Loader2, Image as ImageIcon, X, Sparkles, Wand2 } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import { postsApi, api, type Post } from '@/lib/api';

interface PostFormProps {
  post?: Post;
  mode: 'create' | 'edit';
}

export const PostForm = ({ post, mode }: PostFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(post?.title || '');
  const [subtitle, setSubtitle] = useState(post?.subtitle || '');
  const [content, setContent] = useState(post?.content || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [coverImage, setCoverImage] = useState(post?.coverImage || '');
  const [status, setStatus] = useState<'draft' | 'published'>(post?.status || 'draft');

  const [uploadingImage, setUploadingImage] = useState(false);
  const [generatingTitle, setGeneratingTitle] = useState(false);
  const [generatingSubtitle, setGeneratingSubtitle] = useState(false);
  const [generatingExcerpt, setGeneratingExcerpt] = useState(false);
  const [generatingFull, setGeneratingFull] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const generateFullPost = async () => {
    if (!aiPrompt.trim()) {
      setError('Please enter a prompt describing the blog post you want to create');
      return;
    }

    setGeneratingFull(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'full',
          prompt: aiPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate post');
      }

      const data = await response.json();
      if (data.post) {
        setTitle(data.post.title || '');
        setSubtitle(data.post.subtitle || '');
        setExcerpt(data.post.excerpt || '');
        setContent(data.post.content || '');
        setAiPrompt('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate post');
    } finally {
      setGeneratingFull(false);
    }
  };

  const generateWithAI = async (type: 'title' | 'subtitle' | 'excerpt') => {
    if (type === 'title' && !content.trim()) {
      setError('Please add some content first to generate a title');
      return;
    }
    if ((type === 'subtitle' || type === 'excerpt') && (!title.trim() || !content.trim())) {
      setError('Please add title and content first');
      return;
    }

    const setLoading = type === 'title' ? setGeneratingTitle : type === 'subtitle' ? setGeneratingSubtitle : setGeneratingExcerpt;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          content,
          title: type !== 'title' ? title : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      if (data.text) {
        if (type === 'title') setTitle(data.text);
        else if (type === 'subtitle') setSubtitle(data.text);
        else setExcerpt(data.text);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const result = await api.upload(file);
      setCoverImage(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !excerpt.trim()) {
      setError('Title, content, and excerpt are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = {
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        content,
        excerpt: excerpt.trim(),
        coverImage: coverImage || undefined,
        status,
      };

      if (mode === 'create') {
        await postsApi.create(data);
      } else if (post?._id) {
        await postsApi.update(post._id, data);
      }

      router.push('/admin/posts');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    if (post?.slug) {
      window.open(`/blog/${post.slug}`, '_blank');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button
          type="button"
          onClick={() => router.push('/admin/posts')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Posts
        </button>
        <div className="flex items-center gap-3">
          {mode === 'edit' && post?.slug && (
            <button
              type="button"
              onClick={handlePreview}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {mode === 'create' ? 'Create Post' : 'Save Changes'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {mode === 'create' && (
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Wand2 className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-purple-900">AI Post Generator</h3>
          </div>
          <p className="text-sm text-purple-700 mb-4">
            Describe the blog post you want to create and AI will generate all fields for you.
          </p>
          <div className="flex gap-3">
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="E.g., Write a blog post about the benefits of using QR codes for restaurant menus, including how they improve customer experience and reduce costs..."
              rows={3}
              className="flex-1 px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-white text-slate-900"
              disabled={generatingFull}
            />
            <button
              type="button"
              onClick={generateFullPost}
              disabled={generatingFull || !aiPrompt.trim()}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 self-end"
            >
              {generatingFull ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Post
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="title" className="block text-sm font-medium text-slate-700">
              Title *
            </label>
            <button
              type="button"
              onClick={() => generateWithAI('title')}
              disabled={generatingTitle || !content.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Generate title with AI"
            >
              {generatingTitle ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              AI Generate
            </button>
          </div>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 text-2xl font-bold border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
            placeholder="Enter post title..."
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="subtitle" className="block text-sm font-medium text-slate-700">
              Subtitle
            </label>
            <button
              type="button"
              onClick={() => generateWithAI('subtitle')}
              disabled={generatingSubtitle || !title.trim() || !content.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Generate subtitle with AI"
            >
              {generatingSubtitle ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              AI Generate
            </button>
          </div>
          <input
            type="text"
            id="subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full px-4 py-3 text-lg border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
            placeholder="Optional subtitle..."
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="excerpt" className="block text-sm font-medium text-slate-700">
              Excerpt *
            </label>
            <button
              type="button"
              onClick={() => generateWithAI('excerpt')}
              disabled={generatingExcerpt || !title.trim() || !content.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Generate excerpt with AI"
            >
              {generatingExcerpt ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              AI Generate
            </button>
          </div>
          <textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white text-slate-900"
            placeholder="Short preview text for listings..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Cover Image
          </label>
          {coverImage ? (
            <div className="relative rounded-lg overflow-hidden bg-slate-100">
              <img
                src={coverImage}
                alt="Cover preview"
                className="w-full h-48 object-cover"
              />
              <button
                type="button"
                onClick={() => setCoverImage('')}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="cover-image"
                disabled={uploadingImage}
              />
              <label
                htmlFor="cover-image"
                className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
              >
                {uploadingImage ? (
                  <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-sm text-slate-500">Click to upload cover image</span>
                  </>
                )}
              </label>
            </div>
          )}
          <p className="mt-2 text-xs text-slate-500">
            Or enter URL directly:
          </p>
          <input
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Content *
          </label>
          <RichTextEditor content={content} onChange={setContent} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Status
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="draft"
                checked={status === 'draft'}
                onChange={() => setStatus('draft')}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-slate-700">Draft</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="published"
                checked={status === 'published'}
                onChange={() => setStatus('published')}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-slate-700">Published</span>
            </label>
          </div>
        </div>
      </div>
    </form>
  );
};
