import { Comment } from "@/types";

export const comments: Comment[] = [
  {
    id: "1",
    characterId: "1",
    userId: "3",
    content:
      "Goku is absolutely amazing! His determination and pure heart make him the perfect protagonist. Love his Kamehameha attack!",
    rating: 5,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    characterId: "1",
    userId: "4",
    content:
      "The strongest Saiyan warrior! His character development throughout the series is incredible.",
    rating: 5,
    createdAt: "2024-01-16T14:20:00Z",
    updatedAt: "2024-01-16T14:20:00Z",
  },
  {
    id: "3",
    characterId: "2",
    userId: "5",
    content:
      "Believe it! Naruto's journey from being an outcast to becoming Hokage is truly inspiring.",
    rating: 5,
    createdAt: "2024-01-17T09:15:00Z",
    updatedAt: "2024-01-17T09:15:00Z",
  },
  {
    id: "4",
    characterId: "2",
    userId: "3",
    content:
      "His never-give-up attitude and the way he values friendship above everything else is what makes him special.",
    rating: 4,
    createdAt: "2024-01-18T16:45:00Z",
    updatedAt: "2024-01-18T16:45:00Z",
  },
  {
    id: "5",
    characterId: "3",
    userId: "6",
    content:
      "Ichigo's character is so complex and well-developed. His struggle with identity and protecting others is compelling.",
    rating: 4,
    createdAt: "2024-01-19T11:30:00Z",
    updatedAt: "2024-01-19T11:30:00Z",
  },
  {
    id: "6",
    characterId: "4",
    userId: "6",
    content:
      "Luffy's dream of becoming Pirate King and his unwavering loyalty to his crew is what makes him a great captain!",
    rating: 5,
    createdAt: "2024-01-20T13:20:00Z",
    updatedAt: "2024-01-20T13:20:00Z",
  },
  {
    id: "7",
    characterId: "5",
    userId: "7",
    content:
      "Saitama is hilariously overpowered! The contrast between his strength and his mundane problems is perfect comedy.",
    rating: 5,
    createdAt: "2024-01-21T08:10:00Z",
    updatedAt: "2024-01-21T08:10:00Z",
  },
  {
    id: "8",
    characterId: "6",
    userId: "8",
    content:
      "Eren's character arc is one of the most complex and controversial in anime. His transformation is both tragic and fascinating.",
    rating: 4,
    createdAt: "2024-01-22T15:30:00Z",
    updatedAt: "2024-01-22T15:30:00Z",
  },
  {
    id: "9",
    characterId: "7",
    userId: "9",
    content:
      "Tanjiro's kindness and determination to save his sister while maintaining his humanity is truly touching.",
    rating: 5,
    createdAt: "2024-01-23T12:45:00Z",
    updatedAt: "2024-01-23T12:45:00Z",
  },
  {
    id: "10",
    characterId: "8",
    userId: "10",
    content:
      "All Might is the perfect symbol of peace! His sacrifice and dedication to protecting others is heroic.",
    rating: 5,
    createdAt: "2024-01-24T10:20:00Z",
    updatedAt: "2024-01-24T10:20:00Z",
  },
  {
    id: "11",
    characterId: "9",
    userId: "3",
    content:
      "Mikasa's loyalty and combat skills are unmatched. Her devotion to Eren is both beautiful and tragic.",
    rating: 4,
    createdAt: "2024-01-25T14:15:00Z",
    updatedAt: "2024-01-25T14:15:00Z",
  },
  {
    id: "12",
    characterId: "10",
    userId: "6",
    content:
      "Zoro's dedication to becoming the world's greatest swordsman and his loyalty to Luffy is admirable.",
    rating: 4,
    createdAt: "2024-01-26T09:30:00Z",
    updatedAt: "2024-01-26T09:30:00Z",
  },
  {
    id: "13",
    characterId: "11",
    userId: "4",
    content:
      "Vegeta's character development from villain to hero is one of the best in anime. His pride and growth are amazing.",
    rating: 5,
    createdAt: "2024-01-27T16:40:00Z",
    updatedAt: "2024-01-27T16:40:00Z",
  },
  {
    id: "14",
    characterId: "12",
    userId: "5",
    content:
      "Sasuke's complex journey and his relationship with Naruto is one of the most compelling aspects of the series.",
    rating: 4,
    createdAt: "2024-01-28T11:25:00Z",
    updatedAt: "2024-01-28T11:25:00Z",
  },
  {
    id: "15",
    characterId: "13",
    userId: "8",
    content:
      "Levi is humanity's strongest soldier for a reason. His combat skills and leadership are exceptional.",
    rating: 5,
    createdAt: "2024-01-29T13:50:00Z",
    updatedAt: "2024-01-29T13:50:00Z",
  },
];

export const getCommentById = (id: string): Comment | undefined => {
  return comments.find((comment) => comment.id === id);
};

export const getCommentsByCharacterId = (characterId: string): Comment[] => {
  return comments.filter((comment) => comment.characterId === characterId);
};

export const getCommentsByUserId = (userId: string): Comment[] => {
  return comments.filter((comment) => comment.userId === userId);
};

export const searchComments = (query: string): Comment[] => {
  const lowercaseQuery = query.toLowerCase();
  return comments.filter((comment) =>
    comment.content.toLowerCase().includes(lowercaseQuery)
  );
};

export const getCommentsByRating = (rating: number): Comment[] => {
  return comments.filter((comment) => comment.rating === rating);
};

export const getAverageRatingForCharacter = (characterId: string): number => {
  const characterComments = getCommentsByCharacterId(characterId);
  const ratedComments = characterComments.filter(
    (comment) => comment.rating !== undefined
  );

  if (ratedComments.length === 0) return 0;

  const totalRating = ratedComments.reduce(
    (sum, comment) => sum + (comment.rating || 0),
    0
  );
  return Math.round((totalRating / ratedComments.length) * 10) / 10;
};
