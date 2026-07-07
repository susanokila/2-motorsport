import React, { useState } from 'react';
import { Clock, BookOpen, User, Calendar, ArrowLeft } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogSectionProps {
  posts: BlogPost[];
}

export default function BlogSection({ posts }: BlogSectionProps) {
  const [readingPostId, setReadingPostId] = useState<string | null>(null);

  const activePost = posts.find(p => p.id === readingPostId);

  return (
    <div id="blog-section-view" className="space-y-8 pb-16">
      {!readingPostId ? (
        <>
          {/* Header */}
          <div>
            <span className="text-xs uppercase tracking-widest text-orange-500 font-bold">Educational Hub</span>
            <h2 className="text-3xl font-extrabold text-slate-950">Motorsport Blog & Advice</h2>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Read professional guides, vehicle maintenance secrets, and tyre safety checklists written by our workshop engineers.
            </p>
          </div>

          {/* Grid listing */}
          <div className="grid md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="h-44 overflow-hidden relative">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2.5 left-2.5 bg-slate-900/80 text-orange-400 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-2.5 text-xs text-slate-600">
                    <div className="flex gap-4 text-slate-400 font-bold text-[10px]">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{post.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 line-clamp-2 leading-snug">{post.title}</h3>
                    <p className="line-clamp-3 leading-relaxed text-slate-500">{post.content.split('\n\n')[0]}</p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => setReadingPostId(post.id)}
                    className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Article</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        activePost && (
          <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            {/* Action back */}
            <button
              onClick={() => setReadingPostId(null)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Articles</span>
            </button>

            {/* Title block */}
            <div className="space-y-3 pb-6 border-b">
              <span className="text-[10px] uppercase font-bold text-orange-500 tracking-wider bg-orange-50 px-3 py-1 rounded-full">{activePost.category}</span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">{activePost.title}</h1>
              
              <div className="flex flex-wrap gap-4 text-xs text-slate-400 font-bold pt-2">
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />By {activePost.author}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{activePost.date}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{activePost.readTime}</span>
              </div>
            </div>

            {/* Cover image */}
            <div className="rounded-2xl overflow-hidden aspect-video max-h-[380px] border shadow-sm">
              <img src={activePost.image} alt={activePost.title} className="w-full h-full object-cover" />
            </div>

            {/* Markdown style reading */}
            <article className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed whitespace-pre-line space-y-4">
              {activePost.content}
            </article>
          </div>
        )
      )}
    </div>
  );
}
