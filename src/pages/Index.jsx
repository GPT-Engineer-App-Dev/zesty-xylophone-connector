import React, { useEffect, useRef } from 'react';

const CatchTheBallGame = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Game variables
    let score = 0;
    const paddle = { x: 175, y: 380, width: 50, height: 10 };
    const ball = { x: 100, y: 0, size: 10, speed: 2 };

    // Handle mouse movement
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      paddle.x = e.clientX - rect.left - paddle.width / 2;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // Game loop
    const gameLoop = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Move ball
      ball.y += ball.speed;

      // Draw paddle
      ctx.fillStyle = '#0000FF';
      ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

      // Draw ball
      ctx.fillStyle = '#FF0000';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
      ctx.fill();

      // Check collision
      if (
        ball.y + ball.size > paddle.y &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width
      ) {
        score++;
        ball.y = 0;
        ball.x = Math.random() * (canvas.width - ball.size);
      }

      // Check if ball is out
      if (ball.y > canvas.height) {
        ball.y = 0;
        ball.x = Math.random() * (canvas.width - ball.size);
      }

      // Draw score
      ctx.fillStyle = '#000000';
      ctx.font = '16px Arial';
      ctx.fillText(`Score: ${score}`, 8, 20);

      // Call next frame
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Catch the Ball</h1>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="border border-gray-300 bg-white"
      />
      <p className="mt-4 text-gray-600">
        Move your mouse to control the paddle and catch the falling balls!
      </p>
    </div>
  );
};

export default CatchTheBallGame;