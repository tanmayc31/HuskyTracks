import React from "react";
import "./TestimonialsSection.css";

const testimonials = [
    {
        name: "Leslie Alexander",
        role: "MSIS @ Northeastern",
        quote:
            "The HuskyTracks site made it super easy to report my lost item. The design is clean, and the process was smooth!",
        avatar:
            "https://cdn.rareblocks.xyz/collection/clarity/images/testimonial/4/avatar-male-1.png",
    },
    {
        name: "Jacob Jones",
        role: "Student, Khoury College",
        quote:
            "Simple and effective. I reported my headphones, and within a few hours, I was matched with someone who found them!",
        avatar:
            "https://cdn.rareblocks.xyz/collection/clarity/images/testimonial/4/avatar-male-2.png",
    },
    {
        name: "Jenny Wilson",
        role: "Grad Student @ CPS",
        quote:
            "I love how focused this site is on student needs. It's professional but built with the NU campus in mind.",
        avatar:
            "https://cdn.rareblocks.xyz/collection/clarity/images/testimonial/4/avatar-female.png",
    },
];

const TestimonialsSection = () => {
    return (
        <section className="testimonials-wrapper">
            <h2 className="testimonials-heading">What fellow Huskies say about us</h2>

            <div className="glow-wrapper">
                <div className="glow-bg" />

                <div className="testimonials-container">
                    {testimonials.map((t, index) => (
                        <div className="testimonial-card" key={index}>
                            <div className="stars">★★★★★</div>
                            <p className="quote">"{t.quote}"</p>
                            <div className="author-info">
                                <img src={t.avatar} alt={t.name} className="avatar" />
                                <div>
                                    <p className="name">{t.name}</p>
                                    <p className="role">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;