"use client";

import Link from "next/link";
import { FaEthereum, FaUserGraduate, FaBookOpen, FaStar } from "react-icons/fa";

interface CourseCardProps {
  id: string;
  title: string;
  instructor: string;
  price: number;
  level: string;
  thumbnail?: string;
  rating?: number;
}

export default function CourseCard({ 
  id, 
  title, 
  instructor, 
  price, 
  level, 
  thumbnail,
  rating = 4.5 
}: CourseCardProps) {
  return (
    <Link href={`/courses/${id}`}>
      <div className="group bg-slate-900/50 rounded-2xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all hover:transform hover:-translate-y-2 duration-300 cursor-pointer">
        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden">
          {thumbnail ? (
            <img 
              src={thumbnail} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center">
              <FaBookOpen className="text-5xl text-purple-500/50" />
            </div>
          )}
          {/* Price Badge */}
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
            <FaEthereum className="text-purple-400 text-xs" />
            <span className="text-white font-bold text-sm">{price}</span>
          </div>
          {/* Level Badge */}
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs text-purple-400">
            {level}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-bold text-lg text-white mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors">
            {title}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
            <FaUserGraduate className="text-xs" />
            <span>{instructor}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-400 text-xs" />
              <span className="text-white text-sm font-medium">{rating}</span>
            </div>
            <span className="text-xs text-slate-500">(120+ reviews)</span>
          </div>

          {/* Enroll Button */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg py-2 text-center text-white text-sm font-bold">
              Enroll Now
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}