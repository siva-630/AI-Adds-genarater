import { UploadIcon, VideoIcon, ZapIcon } from 'lucide-react';

export const featuresData = [
    {
        icon: <UploadIcon className="w-6 h-6" />,
        title: 'Smart Upload',
        desc: 'Drag and drop your assets. we are auto optimized formats and images'
    },
    {
        icon: <ZapIcon className="w-6 h-6" />,
        title: 'Instant Generation',
        desc: 'Optimized models deliver output in seconds with great fiedelity.'
    },
    {
        icon: <VideoIcon className="w-6 h-6" />,
        title: 'Video Synthesis',
        desc: 'Bring product shots to life with short-form social-ready videos.'
    }
];

export const plansData = [
    {
        id: 'starter',
        name: 'Starter',
        price: '₹199',
        desc: 'Try the palntform for at small projects.',
        credits: 50,
        features: [
            '50 Credits',
            'Standard quality',
            'No Watermark',
            'Slower generation',
            'Email support'
        ]
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '₹499',
        desc: 'Creators and small teams',
        credits: 250,
        features: [
            '250 Credits',
            'HD quality',
            'No Watermark',
            'Video generation',
            'Priority support'
        ],
        popular: true
    },
    {
        id: 'ultra',
        name: 'ultra',
        price: '₹999',
        desc: 'Scale across teams and projects',
        credits: 500,
        features: [
            '500 Credits',
            'FHD quality',
            'No Watermark',
            'Fast generation speed',
            'Chat + Email support'
        ]
    }
];

export const faqData = [
    {
        question: 'How does the AI generation work?',
        answer: 'We leverage state-of-the-art diffusion models trained of large datasets to generate high-quality iamges and videos based on Your input.'
    },
 
    {
        question: 'Do I own the generrated images?',
        answer: 'Yes you retain full ownership and commercial rights to all images and videos generated throught our palntform.'
    },
    {
        question: 'Can I cancel my subscription?',
        answer: 'Yes you can cancel your subscription at any time from ypur account settings. You will retain access until the end of your billing cycle.'
    },
    {
        question: 'What kind of support do you offer?',
        answer: 'we offer email support for all users. Pro and ultra plan users receive prriorty support with faster response times.'
    },
];

export const footerLinks = [
    {
        title: "Company",
        links: [
            { name: "Home", url: "#" },
            { name: "Features", url: "#" },
            { name: "Pricing", url: "#" },
            { name: "FAQ", url: "#" }
        ]
    },
    {
        title: "Legal",
        links: [
            { name: "Privacy Policy", url: "#" },
            { name: "Terms of Service", url: "#" }
        ]
    },
    {
        title: "Connect",
        links: [
            { name: "Twitter", url: "#" },
            { name: "LinkedIn", url: "#" },
            { name: "GitHub", url: "#" }
        ]
    }
];