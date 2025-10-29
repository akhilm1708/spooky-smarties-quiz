export interface Question {
  question: string;
  options: string[];
  answer: string;
}

export const allQuestions: Question[] = [
  {
    question: "What vegetable was originally used to make Jack-o'-lanterns?",
    options: ["Pumpkin", "Turnip", "Squash", "Potato"],
    answer: "Turnip"
  },
  {
    question: "What country did Halloween originate from?",
    options: ["United States", "England", "Ireland", "Scotland"],
    answer: "Ireland"
  },
  {
    question: "What does the word 'Halloween' mean?",
    options: ["All Hallows' Eve", "Harvest Night", "Ghost Night", "Scary Evening"],
    answer: "All Hallows' Eve"
  },
  {
    question: "Which phobia is the fear of Halloween?",
    options: ["Arachnophobia", "Samhainophobia", "Nyctophobia", "Phasmophobia"],
    answer: "Samhainophobia"
  },
  {
    question: "What is the most popular Halloween candy in the US?",
    options: ["Snickers", "Reese's Peanut Butter Cups", "M&Ms", "Candy Corn"],
    answer: "Reese's Peanut Butter Cups"
  },
  {
    question: "In which century did trick-or-treating become popular in the US?",
    options: ["18th century", "19th century", "20th century", "21st century"],
    answer: "20th century"
  },
  {
    question: "What do you call a group of witches?",
    options: ["A coven", "A flock", "A gathering", "A circle"],
    answer: "A coven"
  },
  {
    question: "Which animal is associated with bad luck on Halloween?",
    options: ["Black cat", "Raven", "Bat", "Spider"],
    answer: "Black cat"
  },
  {
    question: "What is the traditional Halloween game where you grab apples from water?",
    options: ["Apple picking", "Bobbing for apples", "Apple diving", "Water apples"],
    answer: "Bobbing for apples"
  },
  {
    question: "Which famous magician died on Halloween?",
    options: ["David Copperfield", "Harry Houdini", "Penn Jillette", "Criss Angel"],
    answer: "Harry Houdini"
  },
  {
    question: "What is a male witch called?",
    options: ["Wizard", "Warlock", "Sorcerer", "Mage"],
    answer: "Warlock"
  },
  {
    question: "What is the most commercially successful horror movie of all time?",
    options: ["The Exorcist", "It", "Halloween", "A Quiet Place"],
    answer: "It"
  },
  {
    question: "What Celtic festival is Halloween based on?",
    options: ["Beltane", "Samhain", "Imbolc", "Lughnasadh"],
    answer: "Samhain"
  },
  {
    question: "How much does the world's largest pumpkin weigh?",
    options: ["Over 1,000 pounds", "Over 1,500 pounds", "Over 2,000 pounds", "Over 2,500 pounds"],
    answer: "Over 2,500 pounds"
  },
  {
    question: "What is the superstition about seeing a spider on Halloween?",
    options: ["Bad luck", "Good weather", "A loved one is watching over you", "You'll find money"],
    answer: "A loved one is watching over you"
  }
];

export const getRandomQuestions = (count: number = 10): Question[] => {
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};
