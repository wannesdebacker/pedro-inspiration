import { useState, useEffect, useCallback, useMemo } from 'react';
import './quote-slideshow.css';
import data from './data/data.ts';
import Icon from './components/Icon.tsx';

const QuoteSlideshow = () => {
  const SLIDE_DURATION = 25000;
  const BACKGROUND_CHANGE_DURATION = 10 * 60 * 1000;

  const BACKGROUND_IMAGES = useMemo(
    () => [
      'image-1.jpg',
      'image-2.jpg',
      'image-3.jpg',
      'image-4.jpg',
      'image-5.jpg',
      'image-6.jpg',
      'image-7.jpg',
      'image-8.jpg',
      'image-9.jpg',
      'image-10.jpg',
      'image-11.jpg',
      'image-12.jpg',
      'image-13.jpg',
      'image-14.jpg',
    ],
    []
  );

  const filteredQuotes = useMemo(
    () => data.filter((quote) => !quote.startsWith('@')),
    []
  );

  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.floor(Math.random() * filteredQuotes.length)
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentBgImage, setCurrentBgImage] = useState(
    () =>
      BACKGROUND_IMAGES[Math.floor(Math.random() * BACKGROUND_IMAGES.length)]
  );

  const currentQuote = filteredQuotes[currentIndex] || '';

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      } while (randomIndex === prevIndex && filteredQuotes.length > 1);
      return randomIndex;
    });
    setProgress(0);
  }, [filteredQuotes.length]);

  const randomSlide = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    setCurrentIndex(randomIndex);
    setProgress(0);
  }, [filteredQuotes.length]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  useEffect(() => {
    const bgInterval = setInterval(() => {
      const randomImage =
        BACKGROUND_IMAGES[Math.floor(Math.random() * BACKGROUND_IMAGES.length)];
      setCurrentBgImage(randomImage);
    }, BACKGROUND_CHANGE_DURATION);

    return () => clearInterval(bgInterval);
  }, [BACKGROUND_IMAGES, BACKGROUND_CHANGE_DURATION]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + 1;
      });
    }, SLIDE_DURATION / 100);

    return () => clearInterval(interval);
  }, [isPlaying, nextSlide, SLIDE_DURATION]);

  return (
    <div className="slideshow">
      <div
        className="slideshow__background"
        style={{ backgroundImage: `url(./${currentBgImage})` }}
        key={currentBgImage}
      />

      <div className="slideshow__content">
        <div className="slideshow__quote">
          <p className="slideshow__text">{currentQuote}</p>
          <p className="slideshow__signature">GRTZ PEDRO</p>
        </div>
      </div>

      <div className="slideshow__controls">
        <button
          className="slideshow__button"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Icon name="pauze" /> : <Icon name="play" />}
        </button>

        <button
          className="slideshow__button"
          onClick={randomSlide}
          aria-label="Random quote"
        >
          <Icon name="reload" />
        </button>
      </div>

      <div className="slideshow__progress">
        <div
          className="slideshow__progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default QuoteSlideshow;
