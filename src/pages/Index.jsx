import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button"

const PongGame = () => {
  const canvasRef = useRef(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (gameStarted) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      let animationFrameId;

      // Game variables
      const paddleHeight = 80;
      const paddleWidth = 10;
      let playerY = (canvas.height - paddleHeight) / 2;
      let aiY = (canvas.height - paddleHeight) / 2;
      const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 5, dx: 5, dy: 5 };

      const gameLoop = () => {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Move player paddle
        canvas.addEventListener('mousemove', (e) => {
          const rect = canvas.getBoundingClientRect();
          playerY = e.clientY - rect.top - paddleHeight / 2;
        });

        // Simple AI movement
        aiY += (ball.y - (aiY + paddleHeight / 2)) * 0.1;

        // Move ball
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Ball collision with top and bottom
        if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
          ball.dy *= -1;
        }

        // Ball collision with paddles
        if (
          (ball.x - ball.radius < paddleWidth && ball.y > playerY && ball.y < playerY + paddleHeight) ||
          (ball.x + ball.radius > canvas.width - paddleWidth && ball.y > aiY && ball.y < aiY + paddleHeight)
        ) {
          ball.dx *= -1;
        }

        // Score
        if (ball.x - ball.radius < 0) {
          setAiScore(prevScore => prevScore + 1);
          resetBall();
        } else if (ball.x + ball.radius > canvas.width) {
          setPlayerScore(prevScore => prevScore + 1);
          resetBall();
        }

        // Draw paddles
        ctx.fillStyle = '#0000FF';
        ctx.fillRect(0, playerY, paddleWidth, paddleHeight);
        ctx.fillRect(canvas.width - paddleWidth, aiY, paddleWidth, paddleHeight);

        // Draw ball
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#FF0000';
        ctx.fill();
        ctx.closePath();

        // Draw scores
        ctx.font = '24px Arial';
        ctx.fillText(playerScore, canvas.width / 4, 30);
        ctx.fillText(aiScore, 3 * canvas.width / 4, 30);

        animationFrameId = requestAnimationFrame(gameLoop);
      };

      const resetBall = () => {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = 5 * (Math.random() > 0.5 ? 1 : -1);
        ball.dy = 5 * (Math.random() > 0.5 ? 1 : -1);
      };

      gameLoop();

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [gameStarted, playerScore, aiScore]);

  const startGame = () => {
    setGameStarted(true);
    setPlayerScore(0);
    setAiScore(0);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Pong Game</h1>
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="border border-gray-300 bg-white mb-4"
      />
      <Button onClick={startGame} className="mt-4">
        {gameStarted ? 'Restart Game' : 'Start Game'}
      </Button>
    </div>
  );
};

export default PongGame;