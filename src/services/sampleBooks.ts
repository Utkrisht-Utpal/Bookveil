import { Book, Chapter, BookPage } from '../types';
import { db } from './db';

function createPagesFromChapters(
  chapters: { title: string; paragraphs: string[] }[],
  paragraphsPerPage: number = 3
): { pages: BookPage[]; detectedChapters: Chapter[] } {
  const pages: BookPage[] = [];
  const detectedChapters: Chapter[] = [];
  let pageNum = 1;

  // Title / Half-title Page
  pages.push({
    pageNumber: pageNum++,
    htmlContent: `
      <div class="h-full flex flex-col justify-center items-center text-center p-8">
        <div class="w-12 h-1 bg-[#6F8068] mb-8"></div>
        <h1 class="text-3xl font-serif font-medium tracking-wide mb-3">${chapters[0]?.title || 'Title'}</h1>
        <p class="text-sm font-sans tracking-widest uppercase opacity-70">Turna Special Edition</p>
        <div class="mt-12 text-xs font-sans opacity-50 italic">Set in Cormorant Garamond & Inter</div>
      </div>
    `,
    textContent: `${chapters[0]?.title || 'Title'} Turna Edition`,
    chapterTitle: 'Title Page'
  });

  chapters.forEach((ch, chIndex) => {
    detectedChapters.push({
      id: `ch-${chIndex + 1}`,
      title: ch.title,
      pageNumber: pageNum,
      level: 1,
    });

    let currentParagraphs: string[] = [];

    ch.paragraphs.forEach((p, pIndex) => {
      currentParagraphs.push(p);

      if (currentParagraphs.length >= paragraphsPerPage || pIndex === ch.paragraphs.length - 1) {
        const isChapterStart = currentParagraphs.length === ch.paragraphs.slice(0, currentParagraphs.length).length && pIndex < paragraphsPerPage;
        
        const html = `
          <div class="h-full flex flex-col justify-between py-2">
            <div>
              ${isChapterStart ? `
                <div class="mb-6 pb-2 border-b border-current border-opacity-10">
                  <span class="text-xs font-sans uppercase tracking-widest opacity-60">Chapter ${chIndex + 1}</span>
                  <h2 class="text-2xl font-serif font-medium mt-1">${ch.title}</h2>
                </div>
              ` : ''}
              <div class="space-y-4 text-justify leading-relaxed">
                ${currentParagraphs.map((para, idx) => {
                  if (isChapterStart && idx === 0) {
                    const firstLetter = para.charAt(0);
                    const rest = para.slice(1);
                    return `<p><span class="float-left text-4xl font-serif leading-none pr-2 pt-1 font-semibold text-[#6F8068]">${firstLetter}</span>${rest}</p>`;
                  }
                  return `<p>${para}</p>`;
                }).join('')}
              </div>
            </div>
          </div>
        `;

        pages.push({
          pageNumber: pageNum++,
          htmlContent: html,
          textContent: currentParagraphs.join(' '),
          chapterTitle: ch.title,
          headerText: ch.title,
        });

        currentParagraphs = [];
      }
    });
  });

  return { pages, detectedChapters };
}

// Sample Book 1: The Great Gatsby
const gatsbyChapters = [
  {
    title: 'Chapter I',
    paragraphs: [
      'In my younger and more vulnerable years my father gave me some advice that I’ve been turning over in my mind ever since. "Whenever you feel like criticizing anyone," he told me, "just remember that all the people in this world haven’t had the advantages that you’ve had."',
      'He didn’t say any more, but we’ve always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that. In consequence, I’m inclined to reserve all judgements, a habit that has opened up many curious natures to me and also made me the victim of not a few veteran bores.',
      'The abnormal mind is quick to detect and attach itself to this quality when it appears in a normal person, and so it came about that in college I was unjustly accused of being a politician, because I was privy to the secret griefs of wild, unknown men.',
      'Most of the confidences were unsought—frequently I have feigned sleep, preoccupation, or a hostile levity when I realized by some unmistakable sign that an intimate revelation was quivering on the horizon; for the intimate revelations of young men, or at least the terms in which they express them, are usually plagiaristic and marred by obvious suppressions.',
      'Reserving judgements is a matter of infinite hope. I am still a little afraid of missing something if I forget that, as my father snobbishly suggested, and I snobbishly repeat, a sense of the fundamental decencies is parcelled out unequally at birth.',
      'And, after boasting this way of my tolerance, I come to the admission that it has a limit. Conduct may be founded on the hard rock or the wet marshes, but after a certain point I don’t care what it’s founded on. When I came back from the East last autumn I felt that I wanted the world to be in uniform and at a sort of moral attention forever; I wanted no more riotous excursions with privileged glimpses into the human heart.',
      'Only Gatsby, the man who gives his name to this book, was exempt from my reaction—Gatsby, who represented everything for which I have an unaffected scorn. If personality is an unbroken series of successful gestures, then there was something gorgeous about him, some heightened sensitivity to the promises of life, as if he were related to one of those intricate machines that register earthquakes ten thousand miles away.'
    ]
  },
  {
    title: 'Chapter II',
    paragraphs: [
      'About half way between West Egg and New York the motor road hastily joins the railroad and runs beside it for a quarter of a mile, so as to shrink away from a certain desolate area of land. This is a valley of ashes—a fantastic farm where ashes grow like wheat into ridges and hills and grotesque gardens;',
      'where ashes take the forms of houses and chimneys and rising smoke and, finally, with a transcendent effort, of men who move dimly and already crumbling through the powdery air. Occasionally a line of gray cars crawls along an invisible track, gives out a ghastly creak, and comes to rest, and immediately the ash-gray men swarm up with leaden spades and stir up an impenetrable cloud, which screens their obscure operations from your sight.',
      'But above the gray land and the spasms of bleak dust which drift endlessly over it, you perceive, after a moment, the eyes of Doctor T. J. Eckleburg. The eyes of Doctor T. J. Eckleburg are blue and gigantic—their irises are one yard high. They look out of no face, but, instead, from a pair of enormous yellow spectacles which pass over a non-existent nose.',
      'Evidently some wild wag of an oculist set them there to fatten his practice in the borough of Queens, and then sank down himself into eternal blindness, or forgot them and moved away. But his eyes, dimmed a little by many painless days, under sun and rain, brood on over the solemn dumping ground.'
    ]
  },
  {
    title: 'Chapter III',
    paragraphs: [
      'There was music from my neighbor’s house through the summer nights. In his blue gardens men and girls came and went like moths among the whisperings and the champagne and the stars. At high tide in the afternoon I watched his guests diving from the tower of his raft, or taking the sun on the hot sand of his beach while his two motor-boats slit the waters of the Sound, drawing aquaplanes over cataracts of foam.',
      'On week-ends his Rolls-Royce became an omnibus, bearing parties to and from the city between nine in the morning and long past midnight, while his station wagon scampered like a brisk yellow bug to meet all trains. And on Mondays eight servants, including an extra gardener, toiled all day with mops and scrubbing-brushes and hammers and garden-shears, repairing the ravages of the night before.',
      'Every Friday five crates of oranges and lemons arrived from a fruiterer in New York—every Monday these same oranges and lemons left his back door in a pyramid of pulpless halves. There was a machine in the kitchen which could extract the juice of two hundred oranges in half an hour if a little push was given two hundred times by a butler’s thumb.'
    ]
  }
];

// Sample Book 2: Meditations
const meditationsChapters = [
  {
    title: 'Book One: Debts and Lessons',
    paragraphs: [
      'From my grandfather Verus I learned good morals and the government of my temper. From the reputation and remembrance of my father, modesty and a manly character.',
      'From my mother, piety and beneficence, and abstinence, not only from evil deeds, but even from evil thoughts; and further, simplicity in my way of living, far removed from the habits of the rich.',
      'From my great-grandfather, not to have frequented public schools, and to have had good teachers at home, and to know that on such things a man should spend liberally.',
      'From Diognetus, not to busy myself about trifling things, and not to give credit to what was said by miracle-workers and jugglers about incantations and the driving away of daemons and such things; and not to breed quails for fighting, nor to give myself up to such passions; and to endure freedom of speech.'
    ]
  },
  {
    title: 'Book Two: On the River Gran',
    paragraphs: [
      'When you wake up in the morning, tell yourself: The people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous, and surly. They are like this because they cannot distinguish good from evil.',
      'But I have seen the beauty of good, and the ugliness of evil, and have recognized that the wrongdoer has a nature related to my own—not of the same blood or birth, but the same mind, and possessing a share of the divine. And so none of them can hurt me.',
      'No one can implicate me in ugliness. Nor can I feel angry at my relative, or hate him. We were made to work together like feet, like hands, like the rows of the upper and lower teeth. To obstruct each other is unnatural. To feel anger at someone, to turn your back on him: these are obstructions.',
      'Whatever this is that I am, it is a little flesh and breath, and the ruling part. Despise the flesh: blood and bones and a network, a jumble of nerves, veins, and arteries. Consider the breath: wind, always changing, expelled and sucked back again. Third is the ruling master.'
    ]
  },
  {
    title: 'Book Three: The Soul’s Sanctuary',
    paragraphs: [
      'We ought to consider also that even the things which follow after the things which are produced according to nature contain something pleasing and attractive. For instance, when bread is baked some parts are split open on the surface, and these parts which have thus opened, and have a certain fashion contrary to the purpose of the baker’s art, are beautiful in a manner, and in a peculiar way excite a desire for eating.',
      'And again, figs, when they are quite ripe, gape open; and in the ripe olives the very circumstance of their being near to rottenness adds a peculiar beauty to the fruit.',
      'Never value anything as profitable to yourself which shall ever compel you to break your promise, to lose your self-respect, to hate any man, to suspect, to curse, to act the hypocrite, to desire anything which needs walls and curtains.'
    ]
  }
];

// Sample Book 3: The Art of War
const artOfWarChapters = [
  {
    title: 'I. Laying Plans',
    paragraphs: [
      'Sun Tzu said: The art of war is of vital importance to the State. It is a matter of life and death, a road either to safety or to ruin. Hence it is a subject of inquiry which can on no account be neglected.',
      'The art of war, then, is governed by five constant factors, to be taken into account in one’s deliberations, when seeking to determine the conditions obtaining in the field. These are: The Moral Law; Heaven; Earth; The Commander; Method and discipline.',
      'The Moral Law causes the people to be in complete accord with their ruler, so that they will follow him regardless of their lives, undismayed by any danger. Heaven signifies night and day, cold and heat, times and seasons. Earth comprises distances, great and small; danger and security; open ground and narrow passes; the chances of life and death.',
      'All warfare is based on deception. Hence, when able to attack, we must seem unable; when using our forces, we must seem inactive; when we are near, we must make the enemy believe we are far away; when far away, we must make him believe we are near.'
    ]
  },
  {
    title: 'II. Waging War',
    paragraphs: [
      'Sun Tzu said: In the operations of war, where there are in the field a thousand swift chariots, as many heavy chariots, and a hundred thousand mail-clad soldiers, with provisions enough to carry them a thousand li, the expenditure at home and at the front, including entertainment of guests, small items such as glue and paint, and sums spent on chariots and armor, will reach the total of a thousand ounces of silver per day. Such is the cost of raising an army of 100,000 men.',
      'When you engage in actual fighting, if victory is long in coming, then men’s weapons will grow dull and their ardor will be damped. If you lay siege to a town, you will exhaust your strength. Again, if the campaign is protracted, the resources of the State will not be equal to the strain.',
      'Now, when your weapons are dulled, your ardor damped, your strength exhausted and your treasure spent, other chieftains will spring up to take advantage of your extremity. Then no man, however wise, will be able to avert the consequences that must ensue.'
    ]
  }
];

// Sample Book 4: Pride and Prejudice
const prideChapters = [
  {
    title: 'Chapter 1',
    paragraphs: [
      'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.',
      'However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.',
      '“My dear Mr. Bennet,” said his lady to him one day, “have you heard that Netherfield Park is let at last?” Mr. Bennet replied that he had not.',
      '“But it is,” returned she; “for Mrs. Long has just been here, and she told me all about it.” Mr. Bennet made no answer.',
      '“Do you not want to know who has taken it?” cried his wife impatiently. “You want to tell me, and I have no objection to hearing it.” This was invitation enough.'
    ]
  }
];

const gatsbyData = createPagesFromChapters(gatsbyChapters, 2);
const meditationsData = createPagesFromChapters(meditationsChapters, 2);
const artOfWarData = createPagesFromChapters(artOfWarChapters, 2);
const prideData = createPagesFromChapters(prideChapters, 2);

export const SAMPLE_BOOKS: Book[] = [
  {
    id: 'sample-gatsby',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A masterpiece of the Jazz Age exploring ambition, illusion, and longing in the Roaring Twenties.',
    coverColor: '#2D3B36',
    totalPages: gatsbyData.pages.length,
    currentPage: 1,
    progress: 0,
    estimatedReadingTimeMinutes: 24,
    lastReadAt: Date.now() - 3600000 * 2,
    createdAt: Date.now() - 3600000 * 48,
    isFavorite: true,
    fileType: 'sample',
    pages: gatsbyData.pages,
    chapters: gatsbyData.detectedChapters,
    totalWords: 3400,
  },
  {
    id: 'sample-meditations',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    description: 'Timeless Stoic personal reflections on virtue, reason, tranquility, and living with purpose.',
    coverColor: '#4A3B32',
    totalPages: meditationsData.pages.length,
    currentPage: 3,
    progress: Math.round((3 / meditationsData.pages.length) * 100),
    estimatedReadingTimeMinutes: 18,
    lastReadAt: Date.now() - 3600000 * 12,
    createdAt: Date.now() - 3600000 * 72,
    isFavorite: true,
    fileType: 'sample',
    pages: meditationsData.pages,
    chapters: meditationsData.detectedChapters,
    totalWords: 2800,
  },
  {
    id: 'sample-art-of-war',
    title: 'The Art of War',
    author: 'Sun Tzu',
    description: 'Ancient Chinese military treatise on strategy, psychology, preparation, and leadership.',
    coverColor: '#363445',
    totalPages: artOfWarData.pages.length,
    currentPage: 1,
    progress: 0,
    estimatedReadingTimeMinutes: 15,
    lastReadAt: Date.now() - 3600000 * 24,
    createdAt: Date.now() - 3600000 * 96,
    isFavorite: false,
    fileType: 'sample',
    pages: artOfWarData.pages,
    chapters: artOfWarData.detectedChapters,
    totalWords: 2100,
  },
  {
    id: 'sample-pride-prejudice',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description: 'A classic romantic novel of manners, wit, societal expectations, and misunderstandings.',
    coverColor: '#4E383C',
    totalPages: prideData.pages.length,
    currentPage: 1,
    progress: 0,
    estimatedReadingTimeMinutes: 12,
    lastReadAt: Date.now() - 3600000 * 30,
    createdAt: Date.now() - 3600000 * 120,
    isFavorite: false,
    fileType: 'sample',
    pages: prideData.pages,
    chapters: prideData.detectedChapters,
    totalWords: 1600,
  }
];

export async function initializeDatabaseWithSampleBooks() {
  const count = await db.books.count();
  if (count === 0) {
    for (const book of SAMPLE_BOOKS) {
      await db.books.put(book);
    }
  }
}
