"use client";
import React, { useState, useEffect, useRef } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './JournalCarousel.module.css';
import Link from 'next/link';
import myAppWebService from '@/services/myAppWebService';


const SERVER_URL = 'https://files.lpu.in/umsweb/Journal/';
const COLORS = ['#D298BD', '#F4ACAC', '#95D2E5'];

const JournalCarousel = () => {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});
  const sliderRef = useRef<Slider | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await myAppWebService.GetAllBooksDetails();
        if (response && response.item1) {
          setSlides(response.item1);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const navigateToUrl = (id: number, title: string) => {
    const cleanTitle = title?.split('(')[0].trim().replace(/\s+/g, '-').replace(/-$/, '');
    return `/${id}/${cleanTitle}/About`;
  };

  const slideConfig = {
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    infinite: slides.length > 3, 
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, infinite: slides.length > 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1, infinite: slides.length > 1 } }
    ]
  };

  if (loading) return <div className="text-center p-5">Loading Journals...</div>;
  if (slides.length === 0) return <div className="text-center p-5">No Journals Found.</div>;

  return (
    <div className={styles.box}>
      <Slider ref={sliderRef} {...slideConfig}>
        {slides.map((slide, i) => {
          const isError = imageErrors[i];
          const displayImage = isError 
            ? `/assets/journal/${(i % 6) + 1}.jpg`
            : `${SERVER_URL}${slide.imageUrl}`;

          return (
            <div key={slide.id} className={styles.bookSlide}>
              <div className={styles.booka}>
                <div 
                  className={styles.cover} 
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                >
                  <div className={styles.JournalTitle}>
                    <h4 className={styles.JournalTitle + ' fs-4 '}>{slide.journalTitle}</h4>
                  </div>

                  <div className={styles.containera}>
                    <div className={styles.about}>
                      <div className={styles.pic}>
                        <img 
                          src={displayImage}
                          alt={slide.journalTitle}
                          onError={() => setImageErrors(prev => ({ ...prev, [i]: true }))}
                        />
                      </div>

                      <div className={styles.text}>
                        <p>
                          {slide.subTitle?.split(' ').length > 8
                            ? slide.subTitle.split(' ').slice(0, 8).join(' ') + '...'
                            : slide.subTitle}
                          
                          {slide.subTitle?.split(' ').length > 8 && (
                            <Link 
                              href={navigateToUrl(slide.id, slide.journalTitle)}
                              className="ms-2 badge bg-danger text-decoration-none"
                            >
                              Read More
                            </Link>
                          )}
                        </p>
                        
                        <Link 
                          href={navigateToUrl(slide.id, slide.journalTitle)}
                          className={`${styles.journalBtn} btn`}
                        >
                          See The Journal
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>

      <div className={styles.customPrevArrow} onClick={() => sliderRef.current?.slickPrev()}>
        <img src="/assets/images/icon/left-arrow.svg" alt="prev" />
      </div>
      <div className={styles.customNextArrow} onClick={() => sliderRef.current?.slickNext()}>
        <img src="/assets/images/icon/right-arrow.svg" alt="next" />
      </div>
    </div>
  );
};

export default JournalCarousel;