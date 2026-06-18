const fs = require('fs');
const file = 'd:/GitHub/guruConnect/school-website/src/pages/SchoolLanding.tsx';
let content = fs.readFileSync(file, 'utf8');

const stateBlock = `
  const [fetching, setFetching] = useState(true);
  const [homeData, setHomeData] = useState({
    hero: {
      title: "Empowering Minds, Shaping Tomorrow's Leaders",
      subtitle: "At Gyansthali Enlightening, we blend traditional values with cutting-edge digital innovation to provide a holistic learning experience that prepares students for the challenges of a global future.",
      button1: "Apply for 2026-27",
      button2: "Explore Campus",
      announcement: "Now Enrolling: Academic Session 2026-27",
      backgroundImage: "/images/redesign/hero.png"
    },
    stats: [
      { label: 'Success Rate', val: '99%', sub: 'University Placements' },
      { label: 'Expert Faculty', val: '25+', sub: 'Certified Educators' },
      { label: 'Modern Labs', val: '10+', sub: 'World-class Facilities' },
      { label: 'Established', val: '2020', sub: 'Mahesh Nagar, Jaipur' }
    ],
    welcome: {
      title: "Nurturing Excellence in Education",
      subtitle: "Welcome to Gyansthali",
      p1: "Established with a vision to create responsible and capable citizens, Gyansthali has grown to become a premier institution. We offer a comprehensive curriculum that emphasizes conceptual clarity, critical thinking, and holistic development.",
      p2: "Our mission is simple: to empower students with knowledge, confidence, and compassion. Backed by experienced educators and modern infrastructure, we stand out as a top choice for a balanced, future-ready education.",
      button: "Read Our Story",
      image: "/images/redesign/campus_hero.png"
    },
    features: {
      title: "An Ecosystem for \\n<br /><span className=\\"text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-indigo-400 dark:from-indigo-400 dark:to-purple-400\\">Human Excellence</span>",
      subtitle: "Our DNA",
      items: [
        { title: "Smart Learning", desc: "Digitally equipped classrooms with interactive boards and AI-assisted learning tools.", tag: "Technology", icon: "/images/redesign/speed.png" },
        { title: "Holistic Growth", desc: "Special focus on sports, arts, and cultural activities alongside academic rigor.", tag: "Values", icon: "/images/redesign/stats.png" },
        { title: "Safe Campus", desc: "24/7 surveillance and specialized security staff to ensure a secure environment.", tag: "Security", icon: "/images/redesign/security.png" }
      ]
    },
    whyChoose: {
      title: "Why Choose Gyansthali?",
      subtitle: "We provide more than just education; we provide an experience that lasts a lifetime.",
      points: [
        "Digital-First Pedagogy", "Personalized Mentorship", "World-Class Infrastructure",
        "Holistic Development", "Global Exposure", "Values-Based Learning"
      ]
    },
    news: {
      title: "Latest News & Resources",
      subtitle: "Happenings",
      items: [
        { date: "May 9, 2026", title: "17th Annual Inter-School Sports Trophy", img: "/images/redesign/gallery1.png" },
        { date: "May 2, 2026", title: "Mosaic Art & Cultural Fest 2026", img: "/images/redesign/gallery2.png" },
        { date: "Apr 15, 2026", title: "National Science Olympiad Winners", img: "/images/redesign/gallery3.png" }
      ]
    },
    leadership: {
      inspiration: { title: "The Inspiration", quote: '"We proudly honor the visionaries who dedicated their efforts to bringing an international standard of education. The driving force behind our school is a dream, initiative, and unwavering commitment to a learning environment that seamlessly blends modern education with rich Indian culture."', author: "Gyansthali Education Trust", role: "Founding Board" },
      principal: { title: "Principal's Desk", quote: '"At Gyansthali, we believe that the true goal of education is to build knowledge as well as character of our students by enabling them to think intensively and critically. We prepare them not just for exams, but for life."', author: "Mrs. Khushboo Soni", role: "Principal" }
    },
    alumni: {
      title: "Alumni Spotlight",
      subtitle: "Our Legacy",
      items: [
        { name: "Sankalp Sharma", role: "III RD OFFICER", year: "2013" },
        { name: "Deeksha Singh", role: "CORPORATE LAWYER", year: "2009" },
        { name: "Ankit Olla", role: "FIGHTER PILOT, IAF", year: "2015" },
        { name: "Pranjal Rajawat", role: "MARKETING MANAGER", year: "2013" }
      ]
    },
    testimonials: {
      title: "What Parents Say",
      subtitle: "Voices of Trust",
      items: [
        { quote: "Such an interactive and enthusiastic session! So happy that my child is in such wonderful hands. More power to teachers like you.", parent: "Rashmi D", child: "Arohi, Grade 5" },
        { quote: "Aarush was very shy and scared to speak his mind. But the way the teachers communicate with him, he is improving rapidly. I see a lot of change.", parent: "Sonu J", child: "Aaryush, Grade 3" },
        { quote: "We're extremely thankful for the efforts made by the teachers and the way they are dealing with the children. The digital integration is flawless.", parent: "Ashok S", child: "Aryansh, Grade 8" }
      ]
    },
    faqs: {
      title: "Frequently Asked Questions",
      subtitle: "Clear Your Doubts",
      items: [
        { q: "Is Gyansthali affiliated with CBSE?", a: "Yes, we are a fully CBSE-affiliated school offering education from primary to senior secondary levels." },
        { q: "Does the school provide transportation facilities?", a: "Yes, we provide safe and efficient transportation through GPS-enabled buses covering major routes." },
        { q: "What are the key co-curricular activities?", a: "Our framework includes sports, music, dance, coding clubs, robotics, and elocution." },
        { q: "How can I apply for admission?", a: "Admissions can be initiated through our online portal by clicking 'Apply Now' or visiting the campus." }
      ]
    }
  });

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setFetching(true);
        const response = await api.get('/cms/home');
        if (response.data.success && response.data.data) {
          setHomeData(prev => ({
            ...prev,
            ...response.data.data,
            hero: { ...prev.hero, ...(response.data.data.hero || {}) },
            welcome: { ...prev.welcome, ...(response.data.data.welcome || {}) },
            features: { ...prev.features, ...(response.data.data.features || {}) },
            news: { ...prev.news, ...(response.data.data.news || {}) },
            leadership: { ...prev.leadership, ...(response.data.data.leadership || {}) },
            alumni: { ...prev.alumni, ...(response.data.data.alumni || {}) },
            testimonials: { ...prev.testimonials, ...(response.data.data.testimonials || {}) },
            faqs: { ...prev.faqs, ...(response.data.data.faqs || {}) },
          }));
        } else {
          // fallback to hero if home is empty
          const heroRes = await api.get('/cms/hero');
          if (heroRes.data.success && heroRes.data.data) {
             setHomeData(prev => ({ ...prev, hero: { ...prev.hero, ...heroRes.data.data } }));
          }
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchHomeData();
  }, []);

  const heroData = homeData.hero;
`;

// Replace state and fetch logic
content = content.replace(/const \[fetching, setFetching\] = useState\(true\);[\s\S]*?fetchHeroData\(\);\n  \}, \[\]\);/, stateBlock.trim());

// Stats replacement
content = content.replace(/\[\s*\{\s*label:\s*'Success Rate'[\s\S]*?\].map\(\(stat, i\) => \(/, 'homeData.stats.map((stat, i) => (');

// Welcome Section
content = content.replace(/<h5 className="text-xs font-black text-green-500 dark:text-indigo-400 uppercase tracking-\[0\.4em\]">Welcome to Gyansthali<\/h5>/, `<h5 className="text-xs font-black text-green-500 dark:text-indigo-400 uppercase tracking-[0.4em]">{homeData.welcome.subtitle}</h5>`);
content = content.replace(/<h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-themeText tracking-tight leading-tight">Nurturing Excellence in Education<\/h2>/, `<h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-themeText tracking-tight leading-tight">{homeData.welcome.title}</h2>`);
content = content.replace(/Established with a vision to create responsible and capable citizens, Gyansthali has grown to become a premier institution. We offer a comprehensive curriculum that emphasizes conceptual clarity, critical thinking, and holistic development./, `{homeData.welcome.p1}`);
content = content.replace(/Our mission is simple: to empower students with knowledge, confidence, and compassion. Backed by experienced educators and modern infrastructure, we stand out as a top choice for a balanced, future-ready education./, `{homeData.welcome.p2}`);
content = content.replace(/Read Our Story/, `{homeData.welcome.button}`);
content = content.replace(/src="\/images\/redesign\/campus_hero\.png"/, `src={homeData.welcome.image}`);

// Features Section
content = content.replace(/<h5 className="text-xs font-black text-green-500 dark:text-indigo-400 uppercase tracking-\[0\.4em\]">Our DNA<\/h5>/, `<h5 className="text-xs font-black text-green-500 dark:text-indigo-400 uppercase tracking-[0.4em]">{homeData.features.subtitle}</h5>`);
content = content.replace(/<h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-themeText tracking-tight leading-tight">An Ecosystem for[\s\S]*?<\/span><\/h2>/, `<h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-themeText tracking-tight leading-tight" dangerouslySetInnerHTML={{ __html: homeData.features.title }} />`);
content = content.replace(/\[\s*\{\s*title:\s*"Smart Learning"[\s\S]*?\].map\(\(feature, i\) => \(/, 'homeData.features.items.map((feature, i) => (');

// Why Choose
content = content.replace(/<h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-indigo-800 dark:text-white tracking-tight">Why Choose Gyansthali\?<\/h2>/, `<h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-indigo-800 dark:text-white tracking-tight">{homeData.whyChoose.title}</h2>`);
content = content.replace(/<p className="text-indigo-100 max-w-2xl mx-auto font-medium">We provide more than just education; we provide an experience that lasts a lifetime\.<\/p>/, `<p className="text-indigo-100 max-w-2xl mx-auto font-medium">{homeData.whyChoose.subtitle}</p>`);
content = content.replace(/\[\s*"Digital-First Pedagogy"[\s\S]*?\].map\(\(point, i\) => \(/, 'homeData.whyChoose.points.map((point, i) => (');

// News
content = content.replace(/<h5 className="text-xs font-black text-green-500 dark:text-indigo-400 uppercase tracking-\[0\.4em\]">Happenings<\/h5>/, `<h5 className="text-xs font-black text-green-500 dark:text-indigo-400 uppercase tracking-[0.4em]">{homeData.news.subtitle}</h5>`);
content = content.replace(/<h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-themeText tracking-tight">Latest News & Resources<\/h2>/, `<h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-themeText tracking-tight">{homeData.news.title}</h2>`);
content = content.replace(/\[\s*\{\s*date:\s*"May 9, 2026"[\s\S]*?\].map\(\(news, i\) => \(/, 'homeData.news.items.map((news, i) => (');

// Leadership
content = content.replace(/<h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">The Inspiration<\/h3>/, `<h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">{homeData.leadership.inspiration.title}</h3>`);
content = content.replace(/"We proudly honor the visionaries who dedicated their efforts to bringing an international standard of education\. The driving force behind our school is a dream, initiative, and unwavering commitment to a learning environment that seamlessly blends modern education with rich Indian culture\."/, `{homeData.leadership.inspiration.quote}`);
content = content.replace(/<p className="text-white font-black uppercase tracking-widest text-sm">Founding Board<\/p>/, `<p className="text-white font-black uppercase tracking-widest text-sm">{homeData.leadership.inspiration.role}</p>`);
content = content.replace(/<p className="text-indigo-300 text-xs font-bold uppercase tracking-widest mt-1">Gyansthali Education Trust<\/p>/, `<p className="text-indigo-300 text-xs font-bold uppercase tracking-widest mt-1">{homeData.leadership.inspiration.author}</p>`);

content = content.replace(/<h3 className="text-2xl md:text-3xl font-black text-themeText tracking-tight">Principal's Desk<\/h3>/, `<h3 className="text-2xl md:text-3xl font-black text-themeText tracking-tight">{homeData.leadership.principal.title}</h3>`);
content = content.replace(/"At Gyansthali, we believe that the true goal of education is to build knowledge as well as character of our students by enabling them to think intensively and critically\. We prepare them not just for exams, but for life\."/, `{homeData.leadership.principal.quote}`);
content = content.replace(/<p className="text-themeText font-black uppercase tracking-widest text-sm">Mrs\. Khushboo Soni<\/p>/, `<p className="text-themeText font-black uppercase tracking-widest text-sm">{homeData.leadership.principal.author}</p>`);
content = content.replace(/<p className="text-themeTextSec text-xs font-bold uppercase tracking-widest mt-1">Principal<\/p>/, `<p className="text-themeTextSec text-xs font-bold uppercase tracking-widest mt-1">{homeData.leadership.principal.role}</p>`);

// Alumni
content = content.replace(/<h5 className="text-xs font-black text-green-500 dark:text-indigo-400 uppercase tracking-\[0\.4em\]">Our Legacy<\/h5>/, `<h5 className="text-xs font-black text-green-500 dark:text-indigo-400 uppercase tracking-[0.4em]">{homeData.alumni.subtitle}</h5>`);
content = content.replace(/<h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-themeText tracking-tight">Alumni Spotlight<\/h2>/, `<h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-themeText tracking-tight">{homeData.alumni.title}</h2>`);
content = content.replace(/\[\s*\{\s*name:\s*"Sankalp Sharma"[\s\S]*?\].map\(\(alumni, i\) => \(/, 'homeData.alumni.items.map((alumni, i) => (');

// Testimonials
content = content.replace(/<h5 className="text-xs font-black text-green-500 dark:text-indigo-400 uppercase tracking-\[0\.4em\]">Voices of Trust<\/h5>/, `<h5 className="text-xs font-black text-green-500 dark:text-indigo-400 uppercase tracking-[0.4em]">{homeData.testimonials.subtitle}</h5>`);
content = content.replace(/<h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-themeText tracking-tight">What Parents Say<\/h2>/, `<h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-themeText tracking-tight">{homeData.testimonials.title}</h2>`);
content = content.replace(/\[\s*\{\s*quote:\s*"Such an interactive and enthusiastic session![\s\S]*?\].map\(\(testimonial, i\) => \(/, 'homeData.testimonials.items.map((testimonial, i) => (');

// FAQs
content = content.replace(/<h5 className="text-xs font-black text-green-500 dark:text-indigo-400 uppercase tracking-\[0\.4em\]">Clear Your Doubts<\/h5>/, `<h5 className="text-xs font-black text-green-500 dark:text-indigo-400 uppercase tracking-[0.4em]">{homeData.faqs.subtitle}</h5>`);
content = content.replace(/<h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-themeText tracking-tight">Frequently Asked Questions<\/h2>/, `<h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-themeText tracking-tight">{homeData.faqs.title}</h2>`);
content = content.replace(/\[\s*\{\s*q:\s*"Is Gyansthali affiliated with CBSE\?"[\s\S]*?\].map\(\(faq, i\) => \(/, 'homeData.faqs.items.map((faq, i) => (');

fs.writeFileSync(file, content);
console.log('Update script executed.');
