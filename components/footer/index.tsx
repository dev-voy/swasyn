import { Heart } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  const footerLinks = [
    {
      title: "Quick Links",
      links: [
        { name: "Find Doctors", slug: "/doctors" },
        { name: "Services", slug: "/services" },
        { name: "About Us", slug: "/about" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", slug: "/help" },
        { name: "Contact Us", slug: "/contact" },
        { name: "Privacy Policy", slug: "/privacy" },
      ],
    },
    {
      title: "Contact",
      links: [
        { name: "📞 +917447540264", slug: "tel:+917447540264" },
        { name: "✉️  support@swasyn.tech", slug: "mailto:support@swasyn.tech" },
        { name: "📍 123 Healthcare Ave, Medical City", slug: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-6 w-6" />
              <span className="text-xl font-bold">Swasyn</span>
            </div>
            <p className="text-gray-400">
              Making healthcare accessible through technology and compassionate
              care.
            </p>
          </div>

          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2 text-gray-400">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href={link.slug} className="hover:text-white">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Swasyn. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
