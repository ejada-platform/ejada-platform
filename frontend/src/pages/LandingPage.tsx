
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';

// --- Imports for Sliders and Icons ---
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faInstagram, faYoutube, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons'; 
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
// --- THIS IS THE NEW, SIMPLIFIED LIGHTBOX IMPORT ---
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// --- NEW COMPONENT for internal page headers ---
export const PageHeader = ({ title }: { title: string }) => (
    <div className="bg-primary text-light py-12 text-center">
        <h1 className="text-4xl font-bold">{title}</h1>
    </div>
);

// --- Section 1: Hero with Live Statistics ---
const HeroWithStats = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, totalCircles: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get<{ totalStudents: number; totalTeachers: number; totalCircles: number }>('http://localhost:5000/api/stats/overview');
                if (data) setStats(data);
            } catch (error) { console.error("Failed to fetch stats", error); }
        };
        fetchStats();
    }, []);

    return (
        <section id="home"
            className="relative bg-cover bg-center text-white py-70 px-8 text-center"
            // --- THIS IS THE FINAL FIX ---
            // It tells the component to use the image from your public folder as the background
            style={{ backgroundImage: "url('/images/landing.png')" }}
        >
            {/* This div adds a dark overlay, making the white text easier to read */}
            <div className="absolute inset-0 bg-black opacity-60"></div>
            
            <div className="relative z-10">
                <h1 className="text-4xl md:text-6xl font-extrabold">{t('landing_page.hero_title')}</h1>
                <p className="text-lg mt-4 max-w-3xl mx-auto text-gray-200">{t('landing_page.hero_subtitle')}</p>
                <Link to="/enroll" className="mt-8 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition-colors">
                    {t('landing_page.hero_cta_button')}
                </Link>
            </div>
        </section>
    );
};

// --- Section 2: Image Slider ---
const ImageSliderSection = () => {
    const [openVideo, setOpenVideo] = useState<string | null>(null);

    const slides = [
        { img: '/images/slider1.jpeg', youtubeId: 'YOUR_YOUTUBE_ID_1' },
        { img: '/images/slider2.jpeg', youtubeId: 'YOUR_YOUTUBE_ID_2' },
        { img: '/images/slider3.jpeg', youtubeId: 'YOUR_YOUTUBE_ID_3' }
    ];

    const settings = { dots: true, infinite: true, speed: 500, slidesToShow: 1, slidesToScroll: 1, autoplay: true, autoplaySpeed: 4000, arrows: true };

    return (
        <section id="gallery" className="pt-28 pb-16 bg-[#ada687]">
            <div className="max-w-5xl mx-auto px-12">
                <Slider {...settings}>
                    {slides.map((slide, index) => (
                        <div key={index} className="px-2 relative">
                            <img src={slide.img} alt={`Slide ${index+1}`} className="rounded-lg shadow-xl w-full h-auto max-h-[500px] object-cover mx-auto" />
                            <div onClick={() => setOpenVideo(slide.youtubeId)} className="absolute inset-0 flex items-center justify-center cursor-pointer">
                                <div className="bg-red-600 h-20 w-20 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path></svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>

            {/* --- The New Lightbox Implementation --- */}
            <Lightbox
                open={!!openVideo}
                close={() => setOpenVideo(null)}
                slides={openVideo ? [{
                    type: "video" as "video", // Change type to "video"
                    sources: [{ src: `https://www.youtube.com/embed/${openVideo}?autoplay=1`, type: "video/youtube" }]
                }] : []}
                render={{
                    slide: ({ slide }) => (slide.type === 'video' ? <div style={{ width: '100%', height: 'calc(100vh - 120px)' }} dangerouslySetInnerHTML={{ __html: slide.html }} /> : undefined),
                }}
            />
        </section>
    );
};
// --- Section 3: Educational Courses ---
const CoursesSection = () => {
    const { t } = useTranslation();
    const courses = [
        { titleKey: 'landing_page.programs.program1_title', img: '/images/slider4.jpeg.jpeg' },
        { titleKey: 'landing_page.programs.program2_title', img: '/images/slider2.jpeg' },
        { titleKey: 'landing_page.programs.program3_title', img: '/images/slider3.jpeg' },
        { titleKey: 'landing_page.programs.program3_title', img: '/images/slider3.jpeg' }
    ];

    return (
        <section id='programs' className="py-20 bg-[#ada687]">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-12">{t('landing_page.programs.title')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {courses.map((course, i) => (
                        <div key={i} className="bg-white border border-gray-200 rounded-lg shadow-lg text-center p-6">
                            <img src={course.img} alt={t(course.titleKey)} className="w-full h-40 object-cover rounded-md mb-4" />
                            <h3 className="text-xl font-bold mb-4">{t(course.titleKey)}</h3>
                            <Link to="/enroll" className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">{t('landing_page.programs.register_now')}</Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};


// --- NEW Section 4a: Projects (6 Rows of Pictures) ---
 {/*
const ProjectsSection = () => {
    const { t } = useTranslation();
    // Create 8 placeholder images (replace with real paths)
    //const projectImages = Array.from({ length: 8 }, (_, i) => `/images/projects/project${i + 1}.jpg`);
    const projectImages = [
        "/images/slider4.jpeg.jpeg",
        "/images/slider2.jpeg",
        "/images/slider3.jpeg",
        "/images/program2.jpg",
        "/images/program3.jpg",
        "/images/contact.png",
        "/images/slider1.jpeg", // Repeating for placeholder
        "/images/slider2.jpeg"  // Repeating for placeholder
    ];
    return (
        <section id="projects" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">{t('Our Projects')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {projectImages.map((src, index) => (
                        <div key={index} className="aspect-square relative overflow-hidden rounded-lg shadow-lg group cursor-pointer">
                            <img 
                                src={src} 
                                alt={`Project ${index + 1}`} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                            />
                             Optional: Add a subtle overlay for a pro look on hover 
                            <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-0 transition-all duration-300"></div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-10">
                     <Link to="/visuals" className="inline-block border border-gray-700 text-gray-700 hover:bg-gray-100 font-semibold py-2 px-6 rounded-lg transition-colors">
                        {t('View All Projects')}
                    </Link>
                </div>
            </div>
        </section>
    );
};*/}

{/*
// --- NEW Section 4b: Publications (6 Rows of Pictures) ---
const PublicationsSection = () => {
    const { t } = useTranslation();
    // Create 8 placeholder images (replace with real paths)
    //const publicationImages = Array.from({ length: 8 }, (_, i) => `/images/publications/pub${i + 1}.jpg`);

    const publicationImages = [
        "/images/slider3.jpeg",
        '/images/slider2.jpeg',
        '/images/program3.jpg',
        '/images/slider1.jpeg',
        '/images/program2.jpg',
        '/images/landing.png', // Corrected from land.jpg to a known image
        '/images/slider3.jpeg', // Repeating for placeholder
        '/images/slider2.jpeg'  // Repeating for placeholder
    
    ];

    return (
        <section id="publications" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">{t('Our Publications')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4"> 
                    {publicationImages.map((src, index) => (
                        <div key={index} className="
                        aspect-[4/3] relative
                        overflow-hidden rounded-lg 
                        shadow-lg group 
                        cursor-pointer 
                        bg-white">
                              <img 
                                src={src} 
                                alt={`Publication ${index + 1}`} 
                                className="
                                w-full h-full object-cover 
                                transition-transform 
                                duration-500 
                                group-hover:scale-110" 
                                />
                            Optional: Add a subtle overlay for a pro look on hover 
                            <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-0 transition-all duration-300"></div>
                        </div>
                    ))}
                </div>
                 <div className="text-center mt-10">
                     <Link to="/library" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-8 rounded-lg shadow-md transition-colors">
                        {t('Explore Library')}
                    </Link>
                </div>
            </div>
        </section>
    );
};*/}

// --- Section 4: Vision & Goals (IMPROVED) ---
const VisionMissionSection = () => {
    const { t } = useTranslation();
    const items = [
        { icon: '✉️', titleKey: 'landing_page.vision.message_title', textKey: 'landing_page.vision.message_text' },
        { icon: '💎', titleKey: 'landing_page.vision.values_title', textKey: 'landing_page.vision.values_text' },
        { icon: '👁️', titleKey: 'landing_page.vision.vision_title', textKey: 'landing_page.vision.vision_text' },
        { icon: '🎯', titleKey: 'landing_page.vision.goals_title', textKey: 'landing_page.vision.goals_text' }
    ];
    return(
        <section id='vision' className="bg-white py-20">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {items.map((item, i) => (
                    <div key={i} className="p-8 rounded-xl text-center bg-gray-50 shadow-lg transition-all duration-300 hover:shadow-xl border-t-4 border-[#375466]">
                        <div className="text-5xl mb-4">{item.icon}</div>
                        <h3 className="text-xl font-bold text-gray-800">{t(item.titleKey)}</h3>
                        <p className="text-gray-600 mt-3">{t(item.textKey)}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

// --- Section 5: Testimonials ---
const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex justify-center text-yellow-400 text-xl">
        {Array.from({ length: 5 }, (_, i) => <span key={i}>{i < rating ? '★' : '☆'}</span>)}
    </div>
);
const TestimonialsSection = () => {
    const { t } = useTranslation();

    // --- Custom, bigger arrow components ---
    const NextArrow = (props: any) => {
        const { onClick } = props;
        return (
            <button
                className="absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 bg-white rounded-full h-12 w-12 flex items-center justify-center shadow-md z-10 text-primary hover:bg-gray-100 transition-colors"
                onClick={onClick}
                aria-label="Next testimonial"
            >
                <FontAwesomeIcon icon={faChevronRight} />
            </button>
        );
    };

    const PrevArrow = (props: any) => {
        const { onClick } = props;
        return (
            <button
                className="absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2 bg-white rounded-full h-12 w-12 flex items-center justify-center shadow-md z-10 text-primary hover:bg-gray-100 transition-colors"
                onClick={onClick}
                aria-label="Previous testimonial"
            >
                <FontAwesomeIcon icon={faChevronLeft} />
            </button>
        );
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    const testimonials = [
        { quote: "The best institution I have known. I recommend that anyone who wants to learn to read and write Arabic and recite the Holy Quran enroll here.", author: "Oussama", rating: 5 },
        { quote: "May Allah bless you and your efforts. The follow-up is very good, and the teacher's teaching and style are distinctive. Thank you very much.", author: "Yamoussa Soumah", rating: 5 },
        { quote: "When we came to Turkey, I was afraid for our children... an institute that teaches Syrian children the Quran... May God reward you.", author: "Hamza Ali", rating: 5 },
        { quote: "A truly blessed initiative that has helped my family connect with the Quran in a profound way. The teachers are patient and knowledgeable.", author: "Bilal Ibn Talib", rating: 5 }
    ];

    return (
        <section id='testimonials' className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-10 relative">
                <h2 className="text-4xl font-bold text-center mb-12">{t('landing_page.testimonials_title')}</h2>
                <Slider {...settings}>
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="px-4">
                            <div className="bg-gray-50 p-8 rounded-lg shadow-lg h-full flex flex-col text-center min-h-[250px] justify-center">
                                <p className="text-gray-600 italic text-lg flex-grow">"{testimonial.quote}"</p>
                                <p className="mt-4 font-bold">- {testimonial.author}</p>
                                <div className="mt-2"><StarRating rating={testimonial.rating} /></div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
};
// --- Section 6: Contact Form ---
const ContactSection = () => {
    const { t } = useTranslation();
    const [status, setStatus] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const data = new FormData(form);
        
        try {
            const response = await axios.post('https://formspree.io/f/mwpqdvjn', data, {
                headers: { 'Accept': 'application/json' }
            });

            if (response.status === 200) {
                setStatus(t('landing_page.contact.success_message'));
                form.reset();
            } else {
                setStatus(t('landing_page.contact.error_message'));
            }
        } catch (error) {
            setStatus(t('landing_page.contact.error_message'));
        }
    };

    
    {/* Contact Info Section className="w-full mt-4 py-3 px-6 bg-blue-600 text-white font-bold rounded hover:bg-blue-700" */}
return(
        <section id='contact' className="py-20 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4">
                 <h2 className="text-4xl font-bold text-center mb-12">{t('landing_page.contact.title')}</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-lg shadow-xl">
                    {/* Left side: Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="grid md:grid-cols-2 gap-4">
                            <input type="text" name="name" placeholder={t('landing_page.contact.name')} className="w-full p-3 border rounded-md" required />
                            <input type="email" name="email" placeholder={t('landing_page.contact.email')} className="w-full p-3 border rounded-md" required />
                        </div>
                        <textarea name="message" placeholder={t('landing_page.contact.message')} rows={5} className="w-full p-3 border rounded-md mt-4" required></textarea>
                        <button type="submit" className="w-full mt-4 py-3 px-6 bg-primary text-light font-bold bg-blue-600 text-white rounded hover:bg-blue-700 hover:opacity-90">
                            {t('landing_page.contact.send_button')}
                        </button>
                        {status && <p className="mt-4 text-center">{status}</p>}
                    </form>
                    {/* Right side: Image and Details */}
                    <div className="text-center">
                        <img src="/images/contact.png" alt="Contact Us" className="rounded-lg shadow-md mb-6 w-full object-cover h-64" />
                        <div className="space-y-4">
                            <a href="tel:+90 531 705 5332" className="flex items-center justify-center gap-3 text-lg text-gray-800 hover:text-primary transition-colors">
                                <FontAwesomeIcon icon={faPhone} className="text-primary"/>
                                <span>+90 531 705 5332</span>
                            </a>
                            <a href="mailto:info@ejadah.com" className="flex items-center justify-center gap-3 text-lg text-gray-800 hover:text-primary transition-colors">
                                <FontAwesomeIcon icon={faEnvelope} className="text-primary"/>
                                <span>info@ejadah.com</span>
                            </a>
                        </div>
                    </div>
                 </div>
            </div>
        </section>
    );  
};


const Footer = () => {
    const { t } = useTranslation();
    return (
         <footer className="bg-[#375466] text-white pt-16 pb-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left px-4">
                {/* Column 1: About */}
                <div>
                    <h3 className="text-xl font-bold mb-4">Ejadah</h3>
                    <p className="text-gray-400">{t('landing_page.footer_about')}</p>
                </div>
                {/* Column 2: Pages */}
                <div>
                    <h3 className="text-lg font-bold mb-4">{t('landing_page.footer_pages')}</h3>
                    <ul className="space-y-2">
                        <li><Link to="/" className="hover:underline text-gray-300">Home</Link></li>
                        <li><Link to="/library" className="hover:underline text-gray-300">Library</Link></li>
                        <li><Link to="/support" className="hover:underline text-gray-300">Support</Link></li>
                        <li><Link to="/tutorials" className="hover:underline text-gray-300">Tutorials</Link></li>
                    </ul>
                </div>
                 {/* Column 3: Courses */}
                 <div>
                    <h3 className="text-lg font-bold mb-4">{t('landing_page.footer_courses')}</h3>
                    <ul className="space-y-2">
                        <li><span className="text-gray-300">Quran Recitation</span></li>
                        <li><span className="text-gray-300">Tajweed</span></li>
                        <li><span className="text-gray-300">Arabic Language</span></li>
                    </ul>
                </div>
                 {/* Column 4: Contact & Social */}
                 <div>
                    <h3 className="text-lg font-bold mb-4">{t('landing_page.footer_contact')}</h3>
                    <p className="text-gray-300">info@ejadah.com</p>
                    <p className="text-gray-300">+90 531 705 5332</p>
                    {/* 2. Replace the old <i> tags with the <FontAwesomeIcon> component */}
                    <div className="flex justify-center md:justify-start space-x-4 mt-4 text-2xl">
                        <a href="#" aria-label="WhatsApp" className="text-gray-400 hover:text-white transition-colors">
                            <FontAwesomeIcon icon={faWhatsapp} />
                        </a>
                        <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors">
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                         <a href="#" aria-label="YouTube" className="text-gray-400 hover:text-white transition-colors">
                            <FontAwesomeIcon icon={faYoutube} />
                        </a>
                         <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors">
                            <FontAwesomeIcon icon={faFacebook} />
                        </a>
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-6 text-center">
                 <p>&copy; {new Date().getFullYear()} Ejada Platform. {t('landing_page.footer_text')}</p>
            </div>
        </footer>
    );
};
// --- The Main Landing Page Component ---
const LandingPage = () => {
    return (
        <>
            <HeroWithStats />
            <ImageSliderSection />
            <CoursesSection />
            <TestimonialsSection />
            <VisionMissionSection />
           {/* <ProjectsSection /> 
            <PublicationsSection />*/}
            <ContactSection />
            <Footer />
        </>
    );
};

export default LandingPage;