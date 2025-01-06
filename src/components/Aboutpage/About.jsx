'use client'
import React from 'react';
import { 
  Heart, 
  Users, 
  Award, 
  Shield, 
  Globe, 
  Sparkles,
  CheckCircle,
  ArrowRight,
  Linkedin,
  Twitter,
  Mail,
  BookOpen,
  Clock,
  Star,
  Building,
  HeartHandshake,
  Brain,
  Lightbulb
} from 'lucide-react';
import Header from '../Homepage/Header';
import Link from 'next/link';

const stats = [
  { value: "250k+", label: "Lives Impacted", sublabel: "Across 50+ Countries", Icon: Heart },
  { value: "1,500+", label: "Licensed Therapists", sublabel: "Vetted & Certified", Icon: Users },
  { value: "98%", label: "Client Satisfaction", sublabel: "Independent Reviews", Icon: Award },
  { value: "24/7", label: "Support Available", sublabel: "In 20+ Languages", Icon: Shield }
];


const values = [
  {
    title: "Evidence-Based Care",
    description: "Our approach is grounded in scientifically-validated therapeutic methods and continuous research.",
    Icon: Brain,
    details: [
      "Regular outcome measurements",
      "Peer-reviewed methodologies",
      "Research partnerships with leading institutions"
    ]
  },
  {
    title: "Accessibility & Inclusion",
    description: "Breaking down barriers to mental health care through technology and cultural competency.",
    Icon: Globe,
    details: [
      "Income-based pricing options",
      "Multilingual support",
      "Cultural competency training"
    ]
  },
  {
    title: "Clinical Excellence",
    description: "Maintaining the highest standards in therapeutic care through rigorous vetting and supervision.",
    Icon: Award,
    details: [
      "Multi-stage therapist verification",
      "Ongoing professional development",
      "Regular quality assessments"
    ]
  }
];

const certifications = [
  {
    name: "HIPAA Compliant",
    description: "Exceeding healthcare privacy standards",
    Icon: Shield  
  },
  {
    name: "ISO 27001",
    description: "Information security certified",
    Icon: Award
  },
  {
    name: "APA Recognized",
    description: "American Psychological Association",
    Icon: Star
  }
];

const teamMembers = [
  {
    name: "Dr. Sarah Johnson, MD, Ph.D.",
    role: "Founder & Chief Medical Officer",
    bio: "Harvard-trained psychiatrist with 15+ years of experience in mental health innovation. Former Director of Digital Psychiatry at Massachusetts General Hospital.",
    credentials: [
      "Board Certified in Psychiatry",
      "Ph.D. in Neuroscience",
      "Published researcher with 50+ papers"
    ],
    achievements: [
      "Healthcare Innovator of the Year 2022",
      "WHO Mental Health Advisory Board Member",
      "TED Speaker on Digital Mental Health"
    ],
    image: "https://www.materialculture.nl/sites/default/files/styles/hero_mobile/public/photo%20for%20website.jpg?h=c6d1cd02&itok=gNnwaqIU"
  },
  {
    name: "Michael Chen, MBA",
    role: "Chief Technology Officer",
    bio: "Former Google AI Research Lead and MIT graduate. Pioneered AI applications in mental health diagnostics.",
    credentials: [
      "MIT Computer Science",
      "Stanford MBA",
      "Former Google AI Lead"
    ],
    achievements: [
      "Patents in AI Healthcare",
      "Tech Impact Award 2023",
      "Forbes 40 Under 40"
    ],
    image: "https://media.licdn.com/dms/image/v2/D4E03AQHP5C1znKbEUw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1731078021777?e=2147483647&v=beta&t=XtoWOhPVCpdr7X4AHzadK3Gzudrz_-ysDNDYBnnApqc"
  },
  {
    name: "Dr. Emily Rodriguez, Psy.D",
    role: "Head of Therapeutic Services",
    bio: "Specialized in trauma-informed care with 12+ years of clinical experience. Leading expert in digital therapeutics.",
    credentials: [
      "Licensed Clinical Psychologist",
      "Trauma Specialist Certification",
      "Digital Therapeutics Pioneer"
    ],
    achievements: [
      "Author of 'Digital Healing'",
      "Clinical Excellence Award 2023",
      "20+ Published Research Papers"
    ],
    image: "https://photos.psychologytoday.com/e355f3cf-116c-4bd3-9d87-44942ea436c9/1/320x400.jpeg"
  }
];

const advisoryBoard = [
  {
    name: "Prof. James Wilson",
    title: "Head of Psychiatry, Stanford University",
    contribution: "Research & Methodology Advisor"
  },
  {
    name: "Dr. Maria Garcia",
    title: "WHO Mental Health Director",
    contribution: "Global Mental Health Strategy"
  },
  {
    name: "Dr. Robert Chang",
    title: "Chief of Digital Ethics, MIT",
    contribution: "Ethics & Privacy Advisor"
  }
];

const researchPartnerships = [
  {
    institution: "Harvard Medical School",
    project: "Digital Therapeutics Efficacy Study",
    status: "Ongoing",
    year: "2023-2024"
  },
  {
    institution: "Johns Hopkins University",
    project: "AI in Mental Health Diagnostics",
    status: "Published",
    year: "2023"
  },
  {
    institution: "Stanford Research Center",
    project: "Teletherapy Outcomes Analysis",
    status: "Completed",
    year: "2022"
  }
];

const milestones = [
  {
    year: "2020",
    quarter: "Q1",
    title: "Platform Launch",
    description: "Started with a mission to make mental health care accessible to all.",
    achievements: [
      "Initial team of 50 licensed therapists",
      "Successful pilot program with 1,000 users",
      "HIPAA compliance certification"
    ]
  },
  {
    year: "2021",
    quarter: "Q2",
    title: "Service Expansion",
    description: "Introduced specialized programs and group therapy options.",
    achievements: [
      "Launched adolescent support program",
      "Introduced couples therapy",
      "Added 500+ specialists"
    ]
  },
  {
    year: "2022",
    quarter: "Q3",
    title: "Global Expansion",
    description: "Extended services internationally with multilingual support.",
    achievements: [
      "Launched in 50+ countries",
      "20+ language support",
      "Cultural competency program"
    ]
  },
  {
    year: "2023",
    quarter: "Q4",
    title: "AI Integration & Research",
    description: "Advanced our technology while maintaining human-centered care.",
    achievements: [
      "AI-powered matching system",
      "Published efficacy studies",
      "Research partnerships"
    ]
  }
];

const qualityMetrics = [
  {
    metric: "Therapist Response Time",
    value: "< 8 hours",
    target: "Industry standard: 24 hours"
  },
  {
    metric: "Client Matching Accuracy",
    value: "94%",
    target: "Industry standard: 75%"
  },
  {
    metric: "Treatment Effectiveness",
    value: "87%",
    target: "Industry standard: 70%"
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header/>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 px-4 mt-5">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center bg-blue-100 rounded-full px-4 py-2 mb-6">
            <Shield className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-blue-600 font-medium">HIPAA Compliant & ISO 27001 Certified</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Transforming Mental Health Care
            <span className="block text-blue-600 mt-2">Through Innovation & Expertise</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            We combine clinical excellence with cutting-edge technology to deliver 
            evidence-based mental health support that's accessible, effective, and 
            personalized to your needs.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {certifications.map((cert, index) => (
              <div key={index} className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm">
                <cert.Icon className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">{cert.name}</span>
              </div>
            ))}
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <stat.Icon className="w-8 h-8 text-blue-500 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</h3>
                <p className="text-gray-600 font-medium">{stat.label}</p>
                <p className="text-sm text-gray-500">{stat.sublabel}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission & Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to revolutionizing mental health care through evidence-based 
              practices, innovative technology, and unwavering commitment to client well-being.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl hover:shadow-md transition-shadow">
              <value.Icon className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{value.title}</h3>
              <p className="text-gray-600 mb-4">{value.description}</p>
              <ul className="space-y-2">
                {value.details.map((detail, idx) => (
                  <li key={idx} className="flex items-center text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Metrics */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Our Quality Standards
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {qualityMetrics.map((metric, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{metric.metric}</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">{metric.value}</div>
                <p className="text-sm text-gray-500">{metric.target}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Our Leadership Team</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 mb-4">{member.bio}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Credentials</h4>
                    <ul className="space-y-1">
                      {member.credentials.map((credential, idx) => (
                        <li key={idx} className="flex items-center text-gray-600 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {credential}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Achievements</h4>
                    <ul className="space-y-1">
                      {member.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-center text-gray-600 text-sm">
                          <Award className="w-4 h-4 text-blue-500 mr-2" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex space-x-4">
                    <Linkedin className="w-5 h-5 text-gray-400 hover:text-blue-600 cursor-pointer" />
                    <Twitter className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
                    <Mail className="w-5 h-5 text-gray-400 hover:text-blue-600 cursor-pointer" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisory Board */}
      {/* Advisory Board Section (continuing from previous code) */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Advisory Board</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {advisoryBoard.map((advisor, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <BookOpen className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{advisor.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{advisor.title}</p>
                <p className="text-gray-600">{advisor.contribution}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research & Partnerships */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Research & Academic Partnerships</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {researchPartnerships.map((partnership, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl">
                <Building className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{partnership.institution}</h3>
                <div className="mb-4">
                  <span className="inline-flex items-center bg-blue-100 rounded-full px-3 py-1 text-sm text-blue-600">
                    {partnership.status}
                  </span>
                </div>
                <p className="text-gray-700 font-medium mb-2">{partnership.project}</p>
                <p className="text-gray-600">{partnership.year}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our research partnerships ensure that our methods remain cutting-edge 
              and evidence-based, while contributing to the broader field of mental health care.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Our Journey</h2>
          
          <div className="relative">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex flex-col md:flex-row items-start mb-12 relative">
                <div className="md:w-1/4 mb-4 md:mb-0">
                  <span className="text-3xl font-bold text-blue-600">{milestone.year}</span>
                  <span className="block text-gray-500">{milestone.quarter}</span>
                </div>
                <div className="md:w-3/4 bg-white p-6 rounded-xl shadow-md relative">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{milestone.title}</h3>
                  <p className="text-gray-600 mb-4">{milestone.description}</p>
                  <div className="space-y-2">
                    {milestone.achievements.map((achievement, idx) => (
                      <div key={idx} className="flex items-center text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm">{achievement}</span>
                      </div>
                    ))}
                  </div>
                  {index !== milestones.length - 1 && (
                    <div className="hidden md:block absolute h-full w-px bg-blue-200 top-full left-0"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Join Us in Transforming Mental Health Care</h2>
          <p className="text-xl mb-8 opacity-90">
            Whether you're a mental health professional looking to make a broader impact, 
            or someone passionate about our mission, there are many ways to contribute.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white bg-opacity-10 p-6 rounded-xl">
              <HeartHandshake className="w-12 h-12 text-white mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-4">For Therapists</h3>
              <ul className="text-left space-y-2 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Join a network of elite professionals</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Access to cutting-edge therapeutic tools</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Flexible schedule and competitive compensation</span>
                </li>
              </ul>
              <Link href="/therapist">
  <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors">
    Apply as a Therapist
  </button>
</Link>
            </div>
            
            <div className="bg-white bg-opacity-10 p-6 rounded-xl">
              <Lightbulb className="w-12 h-12 text-white mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-4">For Partners</h3>
              <ul className="text-left space-y-2 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Research collaboration opportunities</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Corporate wellness programs</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Technology integration partnerships</span>
                </li>
              </ul>
              <button className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Partner With Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


