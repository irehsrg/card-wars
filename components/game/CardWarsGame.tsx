"use client"

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';

interface GameCard {
  id: number;
  name: string;
  image: string;
  attack: number;
  defense: number;
  cost: number;
  instanceId?: number;
}

const CardWarsGame = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [assets, setAssets] = useState<{
    loaded: boolean;
    cards: GameCard[];
    sounds: Record<string, HTMLAudioElement>;
  }>({
    loaded: false,
    cards: [],
    sounds: {},
  });

  // Sample card data
  const initialCards: GameCard[] = [
    {
      id: 1,
      name: "Husker Knight",
      image: "/api/placeholder/200/280",
      attack: 2,
      defense: 3,
      cost: 2,
    },
    {
      id: 2,
      name: "Cool Dog",
      image: "/api/placeholder/200/280",
      attack: 1,
      defense: 4,
      cost: 2,
    }
  ];

  // Simulated asset loading
  useEffect(() => {
    const loadGameAssets = async () => {
      try {
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setAssets({
          loaded: true,
          cards: initialCards,
          sounds: {
            cardPlay: new Audio(),
            attack: new Audio()
          }
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load game assets:', error);
      }
    };

    loadGameAssets();
  }, []);

  const [playerHand, setPlayerHand] = useState<GameCard[]>([]);
  const [playerField, setPlayerField] = useState<GameCard[]>([]);
  const [playerMana, setPlayerMana] = useState(4);

  const drawCard = () => {
    if (assets.cards.length > 0 && playerHand.length < 5) {
      const randomCard = assets.cards[Math.floor(Math.random() * assets.cards.length)];
      setPlayerHand([...playerHand, { ...randomCard, instanceId: Date.now() }]);
    }
  };

  const playCard = (card: GameCard, index: number) => {
    if (playerMana >= card.cost && playerField.length < 4) {
      setPlayerField([...playerField, card]);
      setPlayerHand(playerHand.filter((_, i) => i !== index));
      setPlayerMana(playerMana - card.cost);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-8 h-8 animate-spin" />
        <p className="ml-2">Loading Card Wars...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Game Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Card Wars</h1>
        <div className="text-blue-400">Mana: {playerMana}</div>
      </div>

      {/* Game Board */}
      <div className="max-w-4xl mx-auto">
        {/* Player Field */}
        <div className="mb-8 p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl mb-4">Field</h2>
          <div className="flex gap-4 min-h-[280px] justify-start items-start">
            {playerField.map((card, index) => (
              <Card key={index} className="w-[200px] bg-gray-700 p-4">
                <img src={card.image} alt={card.name} className="w-full h-40 object-cover rounded mb-2" />
                <h3 className="font-bold">{card.name}</h3>
                <div className="flex justify-between mt-2">
                  <span>ATK: {card.attack}</span>
                  <span>DEF: {card.defense}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Player Hand */}
        <div className="p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl mb-4">Hand</h2>
          <div className="flex gap-4 flex-wrap">
            {playerHand.map((card, index) => (
              <Card 
                key={card.instanceId} 
                className="w-[200px] bg-gray-700 p-4 cursor-pointer transform hover:scale-105 transition-transform"
                onClick={() => playCard(card, index)}
              >
                <img src={card.image} alt={card.name} className="w-full h-40 object-cover rounded mb-2" />
                <h3 className="font-bold">{card.name}</h3>
                <div className="flex justify-between mt-2">
                  <span>ATK: {card.attack}</span>
                  <span>DEF: {card.defense}</span>
                </div>
                <div className="text-center mt-2 text-blue-400">
                  Cost: {card.cost}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Game Controls */}
        <div className="mt-8 text-center">
          <Button 
            onClick={drawCard}
            disabled={playerHand.length >= 5}
            variant="default"
          >
            Draw Card
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardWarsGame;