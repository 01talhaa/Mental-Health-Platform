'use client'

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  BookOpen, 
  Video, 
  Headphones, 
  Clock, 
  Filter,
  Grid,
  List,
  Bookmark,
  BookmarkPlus,
  Share2,
  ChevronDown,
  Play,
  GraduationCap,
  Brain,
  Moon,
  Heart,
  Sparkles,
  Shield
} from 'lucide-react';

// Sample data - expanded with more resources
const categories = [
  { id: 'anxiety', name: 'Anxiety', icon: Brain, color: 'bg-blue-100 text-blue-600' },
  { id: 'depression', name: 'Depression', icon: Heart, color: 'bg-purple-100 text-purple-600' },
  { id: 'stress', name: 'Stress Management', icon: Sparkles, color: 'bg-green-100 text-green-600' },
  { id: 'crisis', name: 'Crisis Support', icon: Shield, color: 'bg-red-100 text-red-600' },
  { id: 'sleep', name: 'Sleep Health', icon: Moon, color: 'bg-indigo-100 text-indigo-600' },
  { id: 'meditation', name: 'Meditation', icon: Brain, color: 'bg-amber-100 text-amber-600' }
];

// Previous imports remain the same...

const resources = [
  {
    id: 1,
    title: 'Understanding Anxiety: A Comprehensive Guide',
    description: 'Learn about the different types of anxiety disorders and evidence-based coping strategies.',
    type: 'article',
    duration: '15 min read',
    category: 'anxiety',
    thumbnail: 'https://alsanabel.qa/Psychiatry/wp-content/uploads/2024/10/1-22.webp',
    progress: 0,
    popularity: 156,
    date: '2024-12-15'
  },
  {
    id: 2,
    title: 'Guided Meditation for Stress Relief',
    description: 'A calming meditation session designed to help reduce stress and promote relaxation.',
    type: 'audio',
    duration: '20 min',
    category: 'meditation',
    thumbnail: 'https://media.karanbajaj.com/karan-live/wp-content/uploads/2016/02/18145003/How-to-meditate-in-2016_-A-complete-guide-Karan-Bajaj.png',
    progress: 75,
    popularity: 243,
    date: '2024-12-20'
  },
  {
    id: 3,
    title: 'Depression Recovery Stories',
    description: 'Real stories from people who have successfully managed their depression.',
    type: 'video',
    duration: '12 min',
    category: 'depression',
    thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6O3ZZGRq1ieOBvcYDmzJI3ih1WkA_H9566g&s',
    progress: 100,
    popularity: 189,
    date: '2024-12-25'
  },
  {
    id: 4,
    title: 'Sleep Hygiene Workshop',
    description: 'Expert tips and strategies for improving your sleep quality and establishing healthy sleep patterns.',
    type: 'video',
    duration: '25 min',
    category: 'sleep',
    thumbnail: 'https://i.ytimg.com/vi/1aOsSyTyje8/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLC8sai176kNAICnhmo92NqNhESeSw',
    progress: 30,
    popularity: 167,
    date: '2024-12-18'
  },
  {
    id: 5,
    title: 'Crisis Management Techniques',
    description: 'Essential strategies for managing mental health crises and seeking appropriate support.',
    type: 'article',
    duration: '10 min read',
    category: 'crisis',
    thumbnail: 'https://slpr.com.my/wp-content/uploads/2023/10/Crisis-Management-Planning.jpg',
    progress: 0,
    popularity: 198,
    date: '2024-12-22'
  },
  {
    id: 6,
    title: 'Stress Reduction Mindfulness Exercise',
    description: 'Guided mindfulness practice for reducing stress and promoting mental wellbeing.',
    type: 'audio',
    duration: '15 min',
    category: 'stress',
    thumbnail: 'https://www.verywellhealth.com/thmb/_zdHPRT3b9Y92Yim-OdtH7ly_dU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/how-to-reduce-stress-5207327_FINAL-907db114a640431ba1e8ecbb9e81b77f.jpg',
    progress: 50,
    popularity: 221,
    date: '2024-12-19'
  }
];

// Rest of the component remains the same...

const Resources = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedResource, setSelectedResource] = useState(null);
  const [savedResources, setSavedResources] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  // Filtered and sorted resources
  const filteredResources = useMemo(() => {
    let filtered = [...resources];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(resource => 
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.category.toLowerCase().includes(query)
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date);
        case 'popularity':
          return b.popularity - a.popularity;
        case 'relevance':
          // If there's a search query, sort by match relevance
          if (searchQuery) {
            const aTitle = a.title.toLowerCase();
            const bTitle = b.title.toLowerCase();
            const query = searchQuery.toLowerCase();
            const aStartsWith = aTitle.startsWith(query) ? -1 : 0;
            const bStartsWith = bTitle.startsWith(query) ? -1 : 0;
            return aStartsWith - bStartsWith;
          }
          // Default to date sort if no search query
          return new Date(b.date) - new Date(a.date);
        default:
          return 0;
      }
    });

    return filtered;
  }, [selectedCategory, searchQuery, sortBy]);

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
    // Optional: Update search results in real-time
    setSearchQuery(e.target.value);
  };

  const TypeIcon = ({ type }) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'audio':
        return <Headphones className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const ResourceCard = ({ resource }) => (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4">
      <div className="relative">
        <img 
          src={resource.thumbnail} 
          alt={resource.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-sm">
          <button
            onClick={() => toggleSave(resource.id)}
            className="text-gray-600 hover:text-blue-600"
          >
            {savedResources.includes(resource.id) ? (
              <Bookmark className="w-5 h-5" />
            ) : (
              <BookmarkPlus className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-2">
        <TypeIcon type={resource.type} />
        <span className="text-sm text-gray-600">{resource.type}</span>
        <Clock className="w-4 h-4 ml-2" />
        <span className="text-sm text-gray-600">{resource.duration}</span>
      </div>

      <h3 className="text-lg font-semibold mb-2 text-gray-800">{resource.title}</h3>
      <p className="text-gray-600 text-sm mb-4">{resource.description}</p>

      {resource.progress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 rounded-full h-2" 
            style={{ width: `${resource.progress}%` }}
          />
        </div>
      )}

      <button 
        onClick={() => setSelectedResource(resource)}
        className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition-colors"
      >
        {resource.progress === 0 ? 'Start Learning' : 'Continue Learning'}
      </button>
    </div>
  );

  const toggleSave = (resourceId) => {
    setSavedResources(prev => 
      prev.includes(resourceId)
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  // No results message
  const NoResults = () => (
    <div className="text-center py-12">
      <div className="text-gray-400 mb-4">
        <Search className="w-12 h-12 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No resources found</h3>
        <p>Try adjusting your search or filters</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Mental Health Resource Library
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Discover expert-curated resources to support your mental health journey.
            Access articles, videos, and audio content at your own pace.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
            <div className="flex items-center bg-white rounded-lg shadow-md">
              <Search className="w-5 h-5 text-gray-400 ml-4" />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full py-3 px-4 rounded-lg focus:outline-none"
                value={searchInput}
                onChange={handleSearchInputChange}
              />
              <button 
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex overflow-x-auto space-x-4 pb-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              All Resources
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.id
                    ? category.color
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <category.icon className="w-5 h-5 mr-2" />
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="py-4 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-white rounded-lg shadow-sm px-4 py-2">
              <Filter className="w-5 h-5 text-gray-400 mr-2" />
              <select 
                className="bg-transparent focus:outline-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance">Most Relevant</option>
                <option value="date">Latest</option>
                <option value="popularity">Most Popular</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${
                viewMode === 'grid' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${
                viewMode === 'list' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Resource Grid */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {filteredResources.length > 0 ? (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <NoResults />
          )}
        </div>
      </section>

      {/* Resource Modal */}
      {selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{selectedResource.title}</h2>
                <button 
                  onClick={() => setSelectedResource(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Resource Content */}
              <div className="space-y-6">
                <img 
                  src={selectedResource.thumbnail} 
                  alt={selectedResource.title}
                  className="w-full h-64 object-cover rounded-lg"
                />

                {/* Resource Meta */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <TypeIcon type={selectedResource.type} />
                    <span className="text-gray-600">{selectedResource.type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{selectedResource.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Play className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {selectedResource.progress}% Complete
                    </span>
                  </div>
                </div>

                <p className="text-gray-600">{selectedResource.description}</p>

                {/* Progress Section */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Your Progress</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className="bg-blue-600 rounded-full h-2" 
                      style={{ width: `${selectedResource.progress}%` }}
                    />
                  </div>
                  {selectedResource.progress > 0 && (
                    <p className="text-sm text-gray-600">
                      Continue where you left off or restart from the beginning.
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button className="flex-1 bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 transition-colors">
                    {selectedResource.progress === 0 ? 'Start Learning' : 'Continue Learning'}
                  </button>
                  <button 
                    onClick={() => toggleSave(selectedResource.id)}
                    className="px-4 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    {savedResources.includes(selectedResource.id) ? (
                      <Bookmark className="w-5 h-5" />
                    ) : (
                      <BookmarkPlus className="w-5 h-5" />
                    )}
                  </button>
                  <button className="px-4 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Related Resources */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Related Resources</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {resources
                      .filter(r => 
                        r.category === selectedResource.category && 
                        r.id !== selectedResource.id
                      )
                      .slice(0, 2)
                      .map(resource => (
                        <div 
                          key={resource.id}
                          className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => setSelectedResource(resource)}
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <TypeIcon type={resource.type} />
                            <span className="text-sm text-gray-600">{resource.duration}</span>
                          </div>
                          <h4 className="font-medium text-gray-800">{resource.title}</h4>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;