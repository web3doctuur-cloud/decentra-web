"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FaEthereum } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function CreateCourse() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Form States
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [videoId, setVideoId] = useState("");
  const [description, setDescription] = useState("");

  // FIX: Added 'async' here
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current user session
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert("You must be logged in to create a course.");
        setLoading(false);
        return;
      }

      // INSERT DATA INTO SUPABASE
      const { error } = await supabase
        .from('courses')
        .insert([
          { 
            title, 
            price: parseFloat(price), 
            level, 
            video_id: videoId, 
            description,
            instructor_id: user.id,
            instructor_name: "Web3Doctuur" 
          },
        ]);

      if (error) {
        alert("Error: " + error.message);
      } else {
        alert("Success! Course listed.");
        router.push("/instructor/dashboard");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-6">
      <Card className="max-w-3xl mx-auto border-purple-500/20 bg-slate-900 text-slate-200">
        <CardHeader>
          <CardTitle className="text-2xl text-white">List a New Course</CardTitle>
          <CardDescription>Your course will be available for purchase in ETH.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-purple-400">Course Title</label>
              <Input 
                className="bg-slate-950 border-slate-800 text-white focus:border-purple-500"
                placeholder="e.g. Solidity 101" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-purple-400">Price (ETH)</label>
                <div className="relative">
                  <Input 
                    type="number" step="0.001" className="pl-10 bg-slate-950 border-slate-800"
                    value={price} onChange={(e) => setPrice(e.target.value)} required
                  />
                  <FaEthereum className="absolute left-3 top-3 text-purple-500" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-purple-400">YouTube Video ID</label>
                <Input 
                  className="bg-slate-950 border-slate-800"
                  placeholder="e.g. AYpftDFiIgk"
                  value={videoId}
                  onChange={(e) => setVideoId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-purple-400">Level</label>
              <select 
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-slate-950 border-slate-800 rounded-md h-10 px-3 text-sm focus:border-purple-500 text-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold h-12"
            >
              {loading ? "Syncing..." : "Create Course Listing"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}