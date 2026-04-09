"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FaGithub, 
  FaPhone, 
  FaGlobe, 
  FaWallet, 
  FaEdit, 
  FaSave, 
  FaTimes,
  FaUserCircle,
  FaTwitter,
  FaLinkedin,
  FaEnvelope
} from "react-icons/fa";
import Link from "next/link";

interface ProfileData {
  full_name: string;
  username: string;
  email: string;
  wallet: string;
  role: string;
  avatar_url: string;
  bio: string;
  github: string;
  twitter: string;
  linkedin: string;
  phone: string;
  nationality: string;
  website: string;
}

export default function Profile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editForm, setEditForm] = useState<ProfileData | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      router.push("/login");
      return;
    }

    // Get user metadata and email
    const metadata = user.user_metadata || {};
    
    const profileData: ProfileData = {
      full_name: metadata.full_name || "",
      username: metadata.username || "",
      email: user.email || "",
      wallet: metadata.wallet_address || metadata.wallet || "Not connected",
      role: metadata.role || "student",
      avatar_url: metadata.avatar_url || "",
      bio: metadata.bio || "No bio yet",
      github: metadata.github || "",
      twitter: metadata.twitter || "",
      linkedin: metadata.linkedin || "",
      phone: metadata.phone || "",
      nationality: metadata.nationality || "",
      website: metadata.website || ""
    };
    
    setProfile(profileData);
    setEditForm(profileData);
    setLoading(false);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edit - revert changes
      setEditForm(profile);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    if (editForm) {
      setEditForm({ ...editForm, [field]: value });
    }
  };

  const handleSave = async () => {
    if (!editForm) return;
    
    setSaving(true);
    
    // Validate required fields
    if (!editForm.username.trim()) {
      alert("Username is required");
      setSaving(false);
      return;
    }

    try {
      // Update user metadata in Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: editForm.full_name,
          username: editForm.username,
          wallet_address: editForm.wallet,
          bio: editForm.bio,
          github: editForm.github,
          twitter: editForm.twitter,
          linkedin: editForm.linkedin,
          phone: editForm.phone,
          nationality: editForm.nationality,
          website: editForm.website,
          avatar_url: editForm.avatar_url,
          role: profile?.role // Preserve role
        }
      });

      if (updateError) {
        alert("Error updating profile: " + updateError.message);
      } else {
        // Also update a profiles table if you have one (optional)
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert({
            id: (await supabase.auth.getUser()).data.user?.id,
            ...editForm,
            updated_at: new Date().toISOString()
          });

        if (upsertError && upsertError.code !== '42P01') { // Ignore if table doesn't exist
          console.error("Error saving to profiles table:", upsertError);
        }

        alert("✅ Profile updated successfully!");
        setProfile(editForm);
        setIsEditing(false);
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const getAvatarUrl = () => {
    if (profile?.avatar_url) return profile.avatar_url;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || "user"}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header with Edit/Save buttons */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-slate-400 text-sm mt-1">Manage your personal information</p>
          </div>
          {!isEditing ? (
            <Button
              onClick={handleEditToggle}
              className="bg-purple-600 hover:bg-purple-700 gap-2"
            >
              <FaEdit /> Edit Profile
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button
                onClick={handleEditToggle}
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <FaTimes /> Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 gap-2"
              >
                <FaSave /> {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <Card className="w-full bg-slate-900/50 backdrop-blur-sm border-purple-500/20 text-white overflow-hidden shadow-2xl shadow-purple-900/20">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900"></div>
          
          {/* Avatar Section */}
          <CardHeader className="flex flex-col items-center -mt-16 relative">
            <div className="relative">
              <img 
                src={getAvatarUrl()} 
                className="w-32 h-32 rounded-full border-4 border-slate-900 bg-slate-800 object-cover shadow-xl" 
                alt="Profile" 
              />
              {isEditing && (
                <button 
                  onClick={() => document.getElementById('avatar-input')?.click()}
                  className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2 shadow-lg hover:bg-purple-700 transition-colors"
                >
                  <FaEdit size={12} />
                </button>
              )}
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file && editForm) {
                    // Upload avatar logic here
                    alert("Avatar upload coming soon!");
                  }
                }}
              />
            </div>
            
            {!isEditing ? (
              <>
                <h2 className="text-2xl font-bold mt-4">{profile.full_name || profile.username}</h2>
                <p className="text-slate-400">@{profile.username}</p>
                <Badge className={profile.role === 'instructor' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gradient-to-r from-blue-600 to-cyan-600'}>
                  {profile.role.toUpperCase()}
                </Badge>
                {profile.bio && <p className="text-slate-300 text-center mt-3 max-w-md">{profile.bio}</p>}
              </>
            ) : (
              <div className="text-center mt-4 space-y-3 w-full max-w-md">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-center"
                  value={editForm?.full_name || ""}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-center"
                  value={editForm?.username || ""}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  required
                />
                <textarea
                  placeholder="Bio"
                  rows={2}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-center"
                  value={editForm?.bio || ""}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                />
              </div>
            )}
          </CardHeader>

          {/* Profile Details */}
          <CardContent className="space-y-6 p-8">
            {/* Contact & Social Info */}
            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-4">Contact & Social</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <FaEnvelope className="text-purple-500 text-xl" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">Email</p>
                    {!isEditing ? (
                      <p className="text-sm text-white">{profile.email}</p>
                    ) : (
                      <input
                        type="email"
                        className="w-full bg-slate-700 rounded px-2 py-1 text-sm text-white"
                        value={editForm?.email || ""}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled
                      />
                    )}
                  </div>
                </div>

                {/* Wallet */}
                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <FaWallet className="text-purple-500 text-xl" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">Wallet Address</p>
                    {!isEditing ? (
                      <p className="text-sm font-mono text-white">{profile.wallet}</p>
                    ) : (
                      <input
                        className="w-full bg-slate-700 rounded px-2 py-1 text-sm font-mono text-white"
                        value={editForm?.wallet || ""}
                        onChange={(e) => handleInputChange('wallet', e.target.value)}
                      />
                    )}
                  </div>
                </div>

                {/* GitHub */}
                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <FaGithub className="text-white text-xl" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">GitHub</p>
                    {!isEditing ? (
                      <p className="text-sm">{profile.github || "Not linked"}</p>
                    ) : (
                      <input
                        className="w-full bg-slate-700 rounded px-2 py-1 text-sm"
                        placeholder="https://github.com/username"
                        value={editForm?.github || ""}
                        onChange={(e) => handleInputChange('github', e.target.value)}
                      />
                    )}
                  </div>
                </div>

                {/* Twitter */}
                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <FaTwitter className="text-blue-400 text-xl" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">Twitter</p>
                    {!isEditing ? (
                      <p className="text-sm">{profile.twitter || "Not linked"}</p>
                    ) : (
                      <input
                        className="w-full bg-slate-700 rounded px-2 py-1 text-sm"
                        placeholder="https://twitter.com/handle"
                        value={editForm?.twitter || ""}
                        onChange={(e) => handleInputChange('twitter', e.target.value)}
                      />
                    )}
                  </div>
                </div>

                {/* LinkedIn */}
                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <FaLinkedin className="text-blue-600 text-xl" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">LinkedIn</p>
                    {!isEditing ? (
                      <p className="text-sm">{profile.linkedin || "Not linked"}</p>
                    ) : (
                      <input
                        className="w-full bg-slate-700 rounded px-2 py-1 text-sm"
                        placeholder="https://linkedin.com/in/username"
                        value={editForm?.linkedin || ""}
                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
                      />
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <FaPhone className="text-green-500 text-xl" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">Phone</p>
                    {!isEditing ? (
                      <p className="text-sm">{profile.phone || "Not set"}</p>
                    ) : (
                      <input
                        className="w-full bg-slate-700 rounded px-2 py-1 text-sm"
                        placeholder="+1234567890"
                        value={editForm?.phone || ""}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    )}
                  </div>
                </div>

                {/* Nationality */}
                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <FaGlobe className="text-cyan-500 text-xl" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">Nationality</p>
                    {!isEditing ? (
                      <p className="text-sm">{profile.nationality || "Not set"}</p>
                    ) : (
                      <input
                        className="w-full bg-slate-700 rounded px-2 py-1 text-sm"
                        placeholder="Country"
                        value={editForm?.nationality || ""}
                        onChange={(e) => handleInputChange('nationality', e.target.value)}
                      />
                    )}
                  </div>
                </div>

                {/* Website */}
                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <FaGlobe className="text-purple-500 text-xl" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">Website</p>
                    {!isEditing ? (
                      <p className="text-sm">{profile.website || "Not set"}</p>
                    ) : (
                      <input
                        className="w-full bg-slate-700 rounded px-2 py-1 text-sm"
                        placeholder="https://yourwebsite.com"
                        value={editForm?.website || ""}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons when not editing */}
            {!isEditing && (
              <div className="flex gap-4 pt-4 border-t border-slate-800">
                <Link href="/dashboard" className="flex-1">
                  <Button variant="outline" className="w-full border-purple-500/30 text-purple-400">
                    ← Back to Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={async () => {
                    if (confirm("Are you sure you want to sign out?")) {
                      await supabase.auth.signOut();
                      router.push("/login");
                    }
                  }}
                  variant="destructive"
                  className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white"
                >
                  Sign Out
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}