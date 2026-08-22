/**
 * Patient Information Library — 45 leaflets, 9 categories.
 *
 * Each leaflet has two "pages" mirroring the printed layout:
 *   page 1 — background, what to expect, who it's for
 *   page 2 — daily habits, aftercare, self-help, "ring us if..."
 *
 * Section shapes the renderer supports inside each page:
 *   { kind: "prose",     title, intro, items: [{ lead, body }] }     — bold lead-in + body
 *   { kind: "numbered",  title, intro, items: [{ title, body }] }    — large number + heading + body
 *   { kind: "list",      title, items: [{ title, tag, body }] }      — checklist with timing tag
 *   { kind: "compare",   title, left: { title, items }, right: { title, items } }
 *   { kind: "callout",   title, body }                               — left-rule highlight (THE GOLDEN RULE)
 *   { kind: "notice",    title, items? , body? }                     — amber boxed advisory
 *   { kind: "timeline",  title, items: [{ time, title, body }] }     — stacked timeline (smoking recovery)
 *
 * To swap out for a real API later, edit clinical.service.js — the function
 * already mirrors the Prisma/REST swap pattern used elsewhere.
 */

export const pilCategories = [
  { slug: "preventive", number: "1", label: "Preventive & Lifestyle Care", color: "#0d7280" },
  { slug: "children",   number: "2", label: "Children & Teenagers",         color: "#2e7d32" },
  { slug: "cosmetic",   number: "3", label: "Cosmetic & Restorative",       color: "#8e3aa0" },
  { slug: "surgery",    number: "4", label: "Oral Surgery & Specialised",   color: "#0277bd" },
  { slug: "gum",        number: "5", label: "Gum & Preventive",             color: "#0d7280" },
  { slug: "function",   number: "6", label: "Function, Habits & Sleep",     color: "#525b76" },
  { slug: "groups",     number: "7", label: "Specific Patient Groups",      color: "#7c2d12" },
  { slug: "practical",  number: "8", label: "Practical & New-Patient",      color: "#4338ca" },
  { slug: "other",      number: "9", label: "Other",                        color: "#b36000" },
];

/* ────────────────────────────────────────────────────────────────────────────
 * Leaflets — listed in print order (01..45). Each entry is self-contained so
 * future edits stay local. Cross-leaflet references are by plain title for now.
 * ──────────────────────────────────────────────────────────────────────────── */

export const pilsFixture = [
  /* ─── 01 · Diet and Your Oral Health ──────────────────────────────────── */
  {
    id: "diet-oral-health",
    num: "01",
    ref: "PI-PRV-01",
    category: "preventive",
    title: "Diet and Your Oral Health",
    summary: "How what you eat — and how often — affects your teeth.",
    intro:
      "What you eat and drink, and how often, has a direct effect on your teeth and gums. Most people focus on the amount of sugar in their diet, but how often you eat it, and the acid in everyday foods and drinks, matter just as much.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          {
            kind: "numbered",
            title: "The “Acid Attack” Cycle",
            intro:
              "Every time you eat or drink something containing sugar or starch, the bacteria living on your teeth turn it into acid. That acid softens the enamel and pulls minerals out of the surface. Saliva slowly puts those minerals back, but it needs time to do its job.",
            items: [
              { title: "The 20-minute rule.", body: "After you eat, the mouth stays acidic for around 20 minutes before saliva can neutralise it and start to repair the enamel." },
              { title: "Frequency, not just quantity.", body: "Grazing on biscuits or sipping a sugary drink through the day keeps the teeth under acid attack with no chance to recover. A single chocolate bar with lunch does much less damage than the same chocolate bar eaten a square at a time over an afternoon." },
              { title: "Sweets at mealtimes.", body: "If you are going to have something sugary, have it at the end of a meal. Saliva flow is already high from chewing, and the damage is bundled into one acid attack rather than several." },
            ],
          },
          {
            kind: "prose",
            title: "Hidden Acids and Erosion",
            intro: "Erosion is different from decay. It is the enamel being chemically dissolved by acid in food and drink, rather than by bacteria. Even foods sold as healthy can do this.",
            items: [
              { lead: "Fruit teas, lemon water and fruit juice.", body: "All highly acidic. “Sugar-free” does not mean “tooth-friendly” — the acid alone is enough to thin enamel over months and years." },
              { lead: "Fizzy drinks.", body: "Both regular and diet versions contain phosphoric or citric acid. Diet versions skip the sugar but not the acid." },
              { lead: "Sticky dried fruit.", body: "Raisins, dates and dried mango are very high in natural sugars and cling to the grooves of the back teeth, stretching out the acid attack." },
              { lead: "Wine, cider and kombucha.", body: "Easy to overlook, but acidic enough to soften enamel, especially when sipped slowly." },
            ],
          },
          {
            kind: "prose",
            title: "Tooth-Friendly Choices",
            items: [
              { lead: "Water.", body: "The best drink for your teeth. Most UK tap water also contains some fluoride, which helps strengthen enamel, and it rinses food off the teeth as you drink." },
              { lead: "Cheese, milk and plain yoghurt.", body: "High in calcium and phosphate, which the teeth use to repair themselves. A small piece of cheese at the end of a meal helps neutralise acid and is a useful trick after a sweet pudding." },
              { lead: "Crunchy raw vegetables and apples.", body: "Carrots, celery and apples get saliva flowing and gently scrub food off the teeth as you chew." },
              { lead: "Sugar-free chewing gum with xylitol.", body: "Chewing for ten minutes after a meal stimulates saliva, and xylitol itself slows the growth of the bacteria that cause decay." },
            ],
          },
        ],
        callout: { title: "The Golden Rule", body: "Keep treats and sugary drinks to mealtimes, and stick to water or plain milk in between. That one habit alone does more for your teeth than almost anything else." },
        notice: { title: "If you have reflux or morning sickness", body: "Stomach acid is far stronger than anything in food, and it can wear teeth down quickly. Please tell us if this is happening — we can help you protect your enamel while it settles." },
      },
      {
        eyebrow: "Everyday Habits",
        pageTitle: "Small Habits That Protect Your Teeth",
        intro:
          "These are the day-to-day habits that make the biggest difference between healthy teeth and ones that need fillings every couple of years. None of them require giving things up — just changing how and when you have them.",
        sections: [
          {
            kind: "list",
            title: "Our Top Recommendations",
            items: [
              { title: "Drink acidic things through a straw.", tag: "DAILY", body: "Fruit juice, smoothies and fizzy drinks all soften enamel. A straw aimed past the front teeth keeps most of the acid off them." },
              { title: "Rinse with plain water afterwards.", tag: "AFTER SWEETS OR ACID", body: "A quick swig of water rinses sugar and acid off the teeth and helps the mouth get back to a normal pH faster." },
              { title: "Wait 30–60 minutes before brushing.", tag: "AFTER ACID", body: "Acid temporarily softens enamel. Brushing straight after a fizzy drink, fruit, wine or being sick scrubs softened enamel away. Rinse with water and wait." },
              { title: "Finish meals with cheese, milk or water.", tag: "AFTER MEALS", body: "A small piece of cheese or a glass of milk neutralises acid and helps the teeth recover." },
              { title: "Chew sugar-free gum for ten minutes after eating.", tag: "AFTER MEALS OUT", body: "Useful when you can’t brush — boosts saliva and shortens the acid attack." },
            ],
          },
          {
            kind: "compare",
            title: "Friendly & Less Friendly Choices",
            left:  { title: "Tooth-Friendly", items: [
              "Water and plain milk between meals.",
              "Cheese, plain yoghurt and unsweetened nuts.",
              "Raw vegetables and whole fruit (better than juice).",
              "Sugar-free gum or mints with xylitol.",
              "Plain tea or coffee — without sugar or syrups.",
            ]},
            right: { title: "Less Friendly", items: [
              "Sipping fizzy or sweetened drinks throughout the day.",
              "Fruit juice, smoothies and squash between meals.",
              "Sticky sweets, dried fruit and cereal bars as snacks.",
              "Slow-sipped lemon water, fruit teas and kombucha.",
              "Brushing immediately after vomiting or after a fizzy drink.",
            ]},
          },
          {
            kind: "list",
            title: "Where Sugar Hides",
            items: [
              { title: "“No added sugar” squashes and flavoured waters.", tag: "OFTEN ACIDIC", body: "Often acidic even when not sweet, and easy to sip continuously." },
              { title: "Flavoured yoghurts and yoghurt drinks.", tag: "HIGH SUGAR", body: "Often contain as much sugar as a chocolate bar. Plain yoghurt with fresh fruit is a much better choice." },
              { title: "Cereal bars and granola.", tag: "STICKY", body: "The “healthy snack” problem — high in sugar and sticky enough to cling to teeth long after eating." },
              { title: "Cough syrups and sugary medicines.", tag: "WATCH OUT", body: "Sugar-free versions are widely available — ask your pharmacist, especially for medicines taken at bedtime." },
            ],
          },
        ],
        noticeBox: { title: "Talk to us if you notice:", items: [
          "Teeth becoming sensitive to cold drinks, ice cream or sweet things.",
          "The biting edges of front teeth looking thinner, see-through or chipped.",
          "Yellow tooth surface starting to show through where the white enamel was.",
          "Frequent reflux, regular vomiting, or a habit of sucking lemons or vinegar drinks.",
        ]},
      },
    ],
  },

  /* ─── 02 · Dental Care During Pregnancy ───────────────────────────────── */
  {
    id: "pregnancy",
    num: "02",
    ref: "PI-PRG-01",
    category: "preventive",
    title: "Dental Care During Pregnancy",
    summary: "What changes in your mouth, and what’s safe to treat.",
    intro:
      "Looking after your teeth and gums is an important part of looking after yourself in pregnancy. Routine dental care is safe at every stage, and there are a few things worth knowing about how pregnancy affects your mouth.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          { kind: "prose", title: "Why It Matters for Your Baby", items: [
            { lead: "", body: "Untreated gum disease in pregnancy has been linked with a higher risk of premature birth and low birth weight. Keeping on top of your oral health is one more thing you can do to give your baby a good start." },
          ]},
          { kind: "numbered", title: "Common Changes in Pregnancy", items: [
            { title: "Pregnancy gingivitis.", body: "Hormonal changes make the gums react more strongly to plaque, so they often look red or puffy and bleed when you brush or floss. It usually settles after birth, but it needs careful brushing in the meantime." },
            { title: "Pregnancy lumps (pyogenic granulomas).", body: "Small red swellings that can appear on the gum line. They are not cancerous and are usually painless, though they can bleed. Most disappear on their own after the baby is born." },
            { title: "A higher risk of decay.", body: "Cravings, more frequent snacking, and skipping the odd brush when you’re tired or feeling sick all add up. Sugary or acidic snacks between meals are the main culprits." },
          ]},
          { kind: "prose", title: "Managing Morning Sickness", intro: "Stomach acid is far stronger than anything you eat or drink, and it softens enamel very quickly. If you are being sick:", items: [
            { lead: "Don’t brush straight away.", body: "The enamel is softened, and brushing scrubs it away. Reach for water first." },
            { lead: "Rinse with water or a fluoride mouthwash.", body: "This helps wash the acid away and bring the mouth back to a normal pH." },
            { lead: "Wait 30–60 minutes before brushing.", body: "This gives saliva time to harden the enamel back up before you brush." },
          ]},
          { kind: "prose", title: "Safe Dental Treatment", items: [
            { lead: "Check-ups and cleanings.", body: "Safe at any stage of pregnancy and the main way we keep gingivitis under control." },
            { lead: "X-rays.", body: "Modern digital X-rays use very low doses of radiation, and we use a lead apron and thyroid collar. We only take X-rays in pregnancy if they are needed for an urgent problem." },
            { lead: "Fillings, extractions and local anaesthetic.", body: "Safe in pregnancy. The local anaesthetic stays in the area we are treating and isn’t a risk to the baby." },
            { lead: "Timing.", body: "Emergency care is done whenever it is needed. For non-urgent treatment, the second trimester is usually the most comfortable time — past the early sickness, before the bump makes lying back uncomfortable." },
          ]},
        ],
        callout: { title: "The old wives’ tale", body: "“A tooth for every baby” is a myth. Pregnancy doesn’t leach calcium out of your teeth. With regular check-ups and good day-to-day care, your teeth come through pregnancy as healthy as they went in." },
        notice: { title: "Always tell us", body: "Please let us know if you are pregnant, or trying to be, before any appointment. It changes which treatments we recommend and when, and lets us tailor your care." },
      },
      {
        eyebrow: "Everyday Habits",
        pageTitle: "Looking After Your Smile in Pregnancy",
        intro: "Sore, bleeding gums and frequent snacking are the two biggest reasons teeth slide backwards in pregnancy. A few small habits keep both in check.",
        sections: [
          { kind: "list", title: "Day-to-Day Routine", items: [
            { title: "Brush twice a day with fluoride toothpaste.", tag: "DAILY", body: "Two minutes, last thing at night and one other time. A soft electric brush is gentler on tender gums and clears more plaque." },
            { title: "Clean between the teeth once a day.", tag: "DAILY", body: "Floss or interdental brushes — whichever you’ll actually use. Bleeding here is the gums asking for more, not less." },
            { title: "Spit, don’t rinse.", tag: "AFTER BRUSHING", body: "Spit out the toothpaste foam but don’t rinse with water — the leftover fluoride keeps protecting the teeth for hours." },
            { title: "Switch to a small, soft brush head if your gag reflex is sensitive.", tag: "AS NEEDED", body: "A children’s toothbrush is a useful trick for the back teeth on bad days." },
          ]},
          { kind: "compare", title: "Eating & Drinking",
            left:  { title: "Helpful Choices", items: [
              "Water and plain milk between meals.",
              "Cheese, plain yoghurt and unsalted nuts as snacks.",
              "Whole fruit at mealtimes (better than juice or smoothies).",
              "Sugar-free gum after meals if you can’t brush.",
            ]},
            right: { title: "Less Helpful", items: [
              "Sipping fruit juice, squash or fizzy drinks through the day.",
              "Sweets, biscuits and dried fruit between meals.",
              "Brushing immediately after being sick.",
              "Lemon water and fruit teas slowly sipped.",
            ]},
          },
          { kind: "list", title: "If Cravings Hit", items: [
            { title: "Have sweet things at the end of a meal.", tag: "MEALTIMES", body: "Saliva is already flowing, so the acid attack is bundled into one — much kinder to teeth than a biscuit every hour." },
            { title: "Rinse with water afterwards.", tag: "QUICK FIX", body: "A swig of plain water rinses sugar off the teeth and helps the mouth recover faster." },
            { title: "Pick the savoury craving when you can.", tag: "WHERE POSSIBLE", body: "Cheese, oatcakes, hummus and crackers don’t feed the bacteria that cause decay." },
            { title: "Ask the pharmacist for sugar-free medicines.", tag: "WHEN PRESCRIBED", body: "Many liquid medicines come in sugar-free versions — worth asking, especially for anything taken at bedtime." },
          ]},
        ],
        noticeBox: { title: "Talk to us if you notice:", items: [
          "Gums bleeding every time you brush, or feeling sore between brushings.",
          "A new lump or swelling on the gum.",
          "Toothache, sensitivity to hot or cold, or a tooth that feels different to bite on.",
          "Frequent vomiting that is wearing the teeth down.",
        ]},
      },
    ],
  },

  /* ─── 03 · Smoking & Your Smile ───────────────────────────────────────── */
  {
    id: "smoking",
    num: "03",
    ref: "PI-SMK-01",
    category: "preventive",
    title: "Smoking & Your Smile",
    summary: "What tobacco does in the mouth — and what changes when you stop.",
    intro:
      "We aren’t here to tell anyone off. But the mouth shows the effects of tobacco sooner and more clearly than almost anywhere else in the body, and there are a few things worth knowing — about what is happening, and what changes if you stop.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          { kind: "numbered", title: "What Tobacco Does in the Mouth", items: [
            { title: "It hides the early warning signs.", body: "Nicotine narrows the blood vessels in the gums, so they stop bleeding when you brush. That sounds like good news, but bleeding is how gums tell you they’re inflamed. Without it, gum disease often runs on quietly until a tooth becomes loose." },
            { title: "It slows healing.", body: "Reduced blood flow and fewer immune cells in the gums mean extractions, gum treatment and surgery all heal more slowly, and infection is more likely." },
            { title: "It changes how the mouth looks and feels.", body: "Tar stains teeth and fillings yellow or brown, sticks to plaque and roughens it, and dries the mouth out. Bad breath, a coated tongue and a dulled sense of taste are part of the same picture." },
          ]},
          { kind: "prose", title: "Gum Disease & Tooth Loss", intro: "Smokers are several times more likely to have advanced gum disease than non-smokers, and lose more teeth from it. Because the bleeding signal is muted, the disease tends to be picked up later, when more bone has already been lost.", items: [
            { lead: "Faster bone loss.", body: "The bone holding the teeth in place is destroyed more quickly, so teeth start to drift, feel loose, or look longer as the gum recedes." },
            { lead: "Poorer response to treatment.", body: "Deep cleanings and gum surgery don’t hold as well in smokers. Stopping makes our treatment work better." },
          ]},
          { kind: "prose", title: "Implants & Smoking", intro: "Dental implants rely on bone growing onto a titanium screw. Smoking interferes with that bone healing, which is why implant failure rates are noticeably higher in smokers than in non-smokers — particularly in the upper jaw.", items: [
            { lead: "Before placement.", body: "We’ll usually ask you to stop, or at least cut right down, for at least a week before the surgery." },
            { lead: "After placement.", body: "Staying off tobacco for the first eight weeks while the bone integrates makes a real difference to the long-term result." },
          ]},
          { kind: "prose", title: "Oral Cancer", items: [
            { lead: "", body: "Tobacco is the biggest single risk factor for cancers of the mouth and throat. That includes cigarettes, cigars, pipes, rolling tobacco, and chewed tobacco such as paan and supari. Drinking heavily on top of smoking multiplies the risk further. We screen for oral cancer at every check-up — see our separate leaflet for the monthly self-check." },
          ]},
        ],
        callout: { title: "It is worth stopping at any age", body: "The risk of gum disease, tooth loss and oral cancer all start to fall as soon as you stop, and keep falling for years. You don’t have to have smoked for a short time, or be young, for it to be worth doing." },
        notice: { title: "A note on vaping", body: "Vaping is a useful step away from tobacco for people who are stopping smoking, and the NHS supports it for that purpose. It isn’t risk-free for the mouth, though — high-nicotine pods still dry the mouth out, irritate the gums and contribute to staining. The aim is to step off it once tobacco is behind you." },
      },
      {
        eyebrow: "Stopping Smoking",
        pageTitle: "What Changes When You Stop",
        intro: "The mouth recovers more quickly than most people expect. Here is roughly what happens, and the help that is available — most of it free on the NHS.",
        sections: [
          { kind: "timeline", title: "The Recovery Timeline", items: [
            { time: "Within 48 hours", title: "Taste and smell start to return.", body: "Food has more flavour again, and breath begins to clear. Saliva flow improves." },
            { time: "Two to four weeks", title: "Gums start to bleed again — this is good news.", body: "As blood flow recovers, the gums respond properly to plaque again. With careful brushing and cleaning between the teeth, the bleeding settles within a few weeks." },
            { time: "Three months", title: "Healing returns to normal.", body: "Extractions, gum treatment and implants heal much like a non-smoker’s. Risk of complications drops sharply." },
            { time: "One year", title: "Risk of gum disease falls steadily.", body: "Existing gum problems respond better to treatment, and the rate of bone loss slows significantly." },
            { time: "Five to ten years", title: "Cancer risk continues to drop.", body: "The risk of oral cancer keeps falling for years after stopping, eventually approaching that of someone who has never smoked." },
          ]},
          { kind: "list", title: "Help to Stop", items: [
            { title: "NHS Stop Smoking services.", tag: "FREE", body: "Free local support, nicotine replacement and stop-smoking medications. People are around three times more likely to stop with this kind of help than on their own. Search “NHS Stop Smoking” online or ask at your GP surgery or pharmacy." },
            { title: "Nicotine replacement.", tag: "OTC", body: "Patches, gum, lozenges, sprays and inhalators are available from any pharmacy. Combining a patch with a fast-acting product (gum or spray) tends to work better than either alone." },
            { title: "Vapes (e-cigarettes).", tag: "AS A STEPPING STONE", body: "Recommended by the NHS as a tool for stopping smoking. Aim to use them as a bridge — taper down the nicotine strength once tobacco is behind you, with a view to stopping the vape too." },
            { title: "Talk to us.", tag: "AT ANY VISIT", body: "Mention it at your next appointment. We can point you to the local stop-smoking service, and time any planned treatment to give your stop attempt the best chance of sticking." },
          ]},
          { kind: "compare", title: "Looking After Your Mouth While You Smoke or Vape",
            left:  { title: "Helps", items: [
              "More frequent hygienist visits — every 3–6 months.",
              "Brushing twice a day with fluoride toothpaste; cleaning between the teeth daily.",
              "Drinking water through the day to counter the dry mouth.",
              "Doing a monthly two-minute self-check for ulcers, lumps and patches.",
            ]},
            right: { title: "Increases Damage", items: [
              "Smoking straight after surgery or an extraction — it dramatically increases the risk of dry socket.",
              "Heavy drinking on top of smoking — multiplies oral cancer risk.",
              "Whitening toothpastes alone — they won’t shift tar staining and can wear enamel.",
              "Skipping check-ups because nothing hurts — gum disease in smokers often doesn’t.",
            ]},
          },
        ],
        noticeBox: { title: "Ring the practice if you notice:", items: [
          "An ulcer, lump or red/white patch in the mouth that has been there more than two weeks.",
          "Teeth feeling loose, drifting, or gums shrinking back.",
          "Persistent bad breath or a bad taste that doesn’t clear with brushing.",
          "Severe pain a few days after an extraction (a sign of dry socket, much more common in smokers).",
        ]},
      },
    ],
  },

  /* ─── 04 · Oral Cancer Awareness ──────────────────────────────────────── */
  {
    id: "oral-cancer",
    num: "04",
    ref: "PI-OCS-01",
    category: "preventive",
    title: "Oral Cancer Awareness",
    summary: "What to look for, who is at higher risk, and the two-minute self-check.",
    intro:
      "We screen for signs of oral cancer at every routine examination. It is a quick, painless part of the appointment, and one of the reasons regular check-ups matter. You see your own mouth far more often than we do, so a little of what to look for goes a long way.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          { kind: "prose", title: "What to Look For", intro: "Oral cancer can affect the lips, tongue, cheeks, gums, the floor of the mouth, and the back of the throat. Most changes you spot will turn out to be harmless, but anything that has lasted more than two weeks is worth showing us.", items: [
            { lead: "Ulcers that don’t heal.", body: "A mouth ulcer or sore that hasn’t cleared up after two weeks." },
            { lead: "Red or white patches.", body: "Patches inside the mouth that don’t rub off and don’t go away." },
            { lead: "New lumps or thickening.", body: "In the mouth, on the lips, or in the neck — including swollen glands that don’t settle." },
            { lead: "Pain or numbness.", body: "Persistent soreness, tingling or numbness in the tongue, lips or jaw." },
            { lead: "Trouble swallowing or moving the tongue.", body: "Including difficulty chewing, or feeling like food is catching." },
            { lead: "A hoarse voice or sore throat.", body: "A change in your voice, or a sore throat sensation, that lasts more than three weeks." },
          ]},
          { kind: "prose", title: "Who Is at Higher Risk", intro: "Anyone can develop oral cancer, but a few things make it more likely. The more of these apply, the more useful the monthly self-check is.", items: [
            { lead: "Tobacco.", body: "Cigarettes, cigars, pipes, rolling tobacco and chewed tobacco — including paan and supari. The biggest single risk factor." },
            { lead: "Alcohol.", body: "Heavy or regular drinking. Drinking and smoking together multiplies the risk well beyond either on its own." },
            { lead: "HPV.", body: "Some strains of the human papillomavirus, particularly HPV16, are linked with cancers at the back of the throat and the base of the tongue." },
            { lead: "Sun exposure.", body: "A risk factor for cancer of the lip, especially the lower lip." },
            { lead: "Age and diet.", body: "Risk rises with age (most cases are over 45), and a diet low in fruit and vegetables is also linked." },
          ]},
          { kind: "numbered", title: "What We Check at Every Examination", items: [
            { title: "The soft tissues.", body: "We look at the tongue (sides and underneath), the cheeks, the floor of the mouth, the roof of the mouth and the throat — not just the teeth." },
            { title: "The neck and jaw.", body: "We feel along the jawline and down the sides of the neck for any unusual lumps or swollen glands." },
            { title: "Anything you’ve noticed.", body: "If you’ve spotted something, please point it out. Even if it’s gone by the time of your appointment, it’s useful for us to know." },
          ]},
        ],
        callout: { title: "If in doubt, get it checked", body: "If you find something that has been there for two weeks, don’t wait for your next routine check. Ring the practice and we will find a slot. Most of the time it turns out to be nothing — and on the rare occasion it isn’t, picking it up early makes a real difference." },
        notice: { title: "Two-week rule", body: "A normal mouth ulcer should heal within ten to fourteen days. Any sore, lump or patch that has been there longer needs a look — that’s the whole rule." },
      },
      {
        eyebrow: "Self-Check & Habits",
        pageTitle: "The Two-Minute Self-Check",
        intro: "A simple monthly check, in front of a mirror with good light, takes about two minutes. Pick a date you’ll remember — the first of the month, or the day a bill comes in. You’re looking for anything that wasn’t there last month and hasn’t cleared up in two weeks.",
        sections: [
          { kind: "list", title: "The Routine", items: [
            { title: "Lips and around the mouth.", tag: "1", body: "Look at the upper and lower lip, inside and out. Pull the lip down to see the gum line. Feel along the lip for any lumps." },
            { title: "The cheeks.", tag: "2", body: "Pull each cheek out with a clean finger. Look for red or white patches, and feel from the outside for any thickening." },
            { title: "The roof of the mouth.", tag: "3", body: "Tilt your head back and check the hard and soft palate for colour changes or lumps." },
            { title: "The tongue.", tag: "4", body: "Stick the tongue out and look at the top. Then move it side to side and check the edges. Lift the tip to the roof of the mouth and look underneath — that area is often missed and is where changes can show up first." },
            { title: "The floor of the mouth.", tag: "5", body: "Look under the tongue. Feel along the floor of the mouth with a finger for any unusual lumps." },
            { title: "The neck and jawline.", tag: "6", body: "With flat fingers, feel along the jaw and down the sides of the neck. Compare one side with the other — they should feel similar." },
          ]},
          { kind: "compare", title: "Lowering Your Risk",
            left:  { title: "Helps", items: [
              "Stopping smoking or chewing tobacco — risk falls steadily once you stop.",
              "Keeping alcohol within the 14 units a week guideline, with several drink-free days.",
              "Plenty of fruit and vegetables in the diet.",
              "Lip balm with SPF 30+ if you spend time outdoors.",
              "Coming for regular check-ups so we can spot changes early.",
            ]},
            right: { title: "Increases Risk", items: [
              "Smoking, vaping with high-nicotine pods, or chewing tobacco/paan.",
              "Heavy drinking, especially combined with smoking.",
              "Long periods in the sun without lip protection.",
              "Ignoring an ulcer, lump or patch that has been there more than two weeks.",
            ]},
          },
          { kind: "list", title: "Help to Stop Smoking", items: [
            { title: "NHS Stop Smoking services.", tag: "FREE", body: "Free local support, nicotine replacement and tablets — people are around three times more likely to stop with help than on their own. Search “NHS Stop Smoking” or ask at your GP surgery." },
            { title: "Talk to us.", tag: "AT ANY VISIT", body: "If you’d like a hand getting started, mention it at your next appointment. We’re happy to help you find the right local service." },
          ]},
        ],
        noticeBox: { title: "Ring the practice if you notice:", items: [
          "An ulcer or sore that hasn’t healed in two weeks.",
          "A red, white or mixed patch in the mouth that doesn’t go away.",
          "A new lump in the mouth, on the lip or in the neck.",
          "Persistent numbness, difficulty swallowing, or a hoarse voice lasting more than three weeks.",
        ]},
      },
    ],
  },

  /* ─── 05 · Children’s Dental Health (0–5) ─────────────────────────────── */
  {
    id: "children-0-5",
    num: "05",
    ref: "PI-PED-01",
    category: "children",
    title: "Children’s Dental Health — 0 to 5 Years",
    summary: "Milestones, brushing routine and what to bring to the first visit.",
    intro:
      "Looking after your child’s teeth starts before the first tooth comes through. This guide sets out the main milestones from birth to age five: what to do at home, when to bring your child in, and the small habits that make the biggest difference.",
    pages: [
      {
        eyebrow: "Patient Information Sheet",
        sections: [
          { kind: "prose", title: "When Should the First Visit Be?", items: [
            { lead: "", body: "We follow guidance from the British Society of Paediatric Dentistry and the American Academy of Pediatric Dentistry: the first dental visit should happen by your child’s first birthday, or within six months of the first tooth appearing — whichever comes first." },
            { lead: "", body: "These early visits are short and gentle. They let your child get used to the sights, sounds and smells of the Practice in a relaxed setting, and let us spot any early signs of decay long before they become a problem. Children seen by their first birthday tend to have lower dental costs over the next five years — because prevention is far cheaper than treatment." },
          ]},
          { kind: "numbered", title: "Key Care Tips by Age", items: [
            { title: "Before Teeth (0–6 months)", body: "Gently wipe your baby’s gums with a clean, damp cloth or gauze square after feeds. This removes milk residue and helps your baby get used to having their mouth cleaned." },
            { title: "First Teeth (6–12 months)", body: "As soon as the first tooth erupts, brush twice a day with a soft baby toothbrush and a smear of fluoride toothpaste — about the size of a grain of rice. Look for at least 1,000 ppm fluoride." },
            { title: "Toddlers (1–3 years)", body: "Continue with a smear of toothpaste, twice daily. Aim to wean from the bottle by 12–14 months — a free-flow cup can be introduced from around six months. Encourage your child to spit, not rinse, after brushing so the fluoride keeps working." },
            { title: "Pre-school (3–5 years)", body: "Move up to a pea-sized amount of fluoride toothpaste (1,350–1,500 ppm). Supervise brushing until at least age 7–8 — children don’t have the dexterity to brush effectively, or the swallow control to use more paste safely, until then." },
          ]},
          { kind: "prose", title: "The Role of Diet", items: [
            { lead: "Avoid “bottle rot.”", body: "Never put your baby to bed with a bottle of milk, formula, or juice. Sugars sit on the teeth all night and can cause severe decay of the front teeth (early childhood caries)." },
            { lead: "Sugars at mealtimes only.", body: "It’s the frequency of sugar that does the damage, not just the amount. Limit sweet snacks and drinks to mealtimes — each sugar exposure causes around 20 minutes of acid attack on the teeth." },
            { lead: "Water and plain milk between meals.", body: "These are the only drinks that are genuinely tooth-friendly. Watch for hidden sugars in fruit juice, smoothies, flavoured milks, yoghurt drinks and “no added sugar” squashes." },
            { lead: "Don’t share spoons or dummies.", body: "Cleaning a dummy or spoon in your own mouth can pass decay-causing bacteria to your baby. Rinse with water instead." },
          ]},
        ],
        callout: { title: "Why baby teeth matter", body: "Baby teeth do real work for several years. They hold the space for the adult teeth that follow, help your child learn to chew and speak clearly, and shape the way they smile. A neglected baby tooth can also cause pain, infection, and problems for the adult tooth growing underneath." },
        notice: { title: "Call us if you notice", body: "White or brown spots on your child’s teeth, swollen or bleeding gums, a knocked-out or chipped tooth, or pain when eating. Early action almost always means simpler treatment." },
      },
      {
        eyebrow: "Parent Care Guide",
        pageTitle: "The Parent’s Tooth Care Checklist",
        intro: "A practical day-to-day guide to building lifelong dental habits at home. Tick each item off as it becomes part of your routine — and pop it on the fridge as a reminder for the rest of the family.",
        sections: [
          { kind: "list", title: "Daily Brushing Routine", items: [
            { title: "Brush twice a day — last thing at night, and one other time.", tag: "FROM TOOTH 1", body: "The bedtime brush matters most: saliva flow drops at night, so anything left on the teeth has hours to do damage." },
            { title: "Use the right amount of fluoride toothpaste for their age.", tag: "EVERY BRUSH", body: "A smear (rice grain) under 3, pea-sized from age 3. A strip the length of the brush is an adult amount." },
            { title: "Spit, don’t rinse.", tag: "AFTER BRUSHING", body: "Rinsing washes the protective fluoride straight off the teeth." },
            { title: "Supervise brushing until at least age 7–8.", tag: "DAILY" },
            { title: "Replace the toothbrush every 3 months — or sooner if frayed.", tag: "QUARTERLY" },
          ]},
          { kind: "compare", title: "At Home: Do & Avoid",
            left:  { title: "Do", items: [
              "Make brushing fun — a 2-minute song, a sticker chart, or brushing alongside you.",
              "Move from bottle to a free-flow cup by 6–12 months.",
              "Offer water or plain milk between meals.",
              "Bring them along to your check-ups so the Practice feels familiar.",
              "Ask us about fluoride varnish from age 2 — quick, painless, applied at check-ups.",
            ]},
            right: { title: "Avoid", items: [
              "Bottles of milk, formula, or juice in bed or as a comforter.",
              "Sugary drinks and snacks between meals — including juice and dried fruit.",
              "Cleaning dummies or spoons in your own mouth.",
              "Letting children brush unsupervised before age 7–8.",
              "Calling the dentist “scary” — even in jest — in front of your child.",
            ]},
          },
          { kind: "list", title: "Teething & Milestones", items: [
            { title: "First tooth around 6 months — all 20 baby teeth by age 3.", tag: "4–36 MONTHS", body: "Some arrive earlier, some later — both are normal." },
            { title: "Soothe sore gums with a chilled (not frozen) teething ring.", tag: "AS NEEDED", body: "A clean cold flannel works too. Avoid teething gels containing benzocaine in under-2s." },
            { title: "Book the first check-up by the first birthday.", tag: "BY 12 MONTHS" },
          ]},
        ],
        noticeBox: { title: "Call the practice if you notice:", items: [
          "White, yellow or brown spots on the teeth — especially near the gumline.",
          "Swollen, red or bleeding gums.",
          "A chipped, knocked-out or discoloured tooth after a fall.",
          "Pain or fussiness when eating, drinking, or brushing.",
          "A persistent thumb-sucking or dummy habit beyond age 3.",
        ]},
      },
    ],
  },

  /* ─── 09 · Tooth Whitening ────────────────────────────────────────────── */
  {
    id: "tooth-whitening",
    num: "09",
    ref: "PI-WHT-01",
    category: "cosmetic",
    title: "Tooth Whitening",
    summary: "How it works, what it can and can’t do, and the UK rules.",
    intro:
      "Whitening lifts the natural colour of your own teeth a few shades. It works well for most adults, but it isn’t magic, and the gels sold over the counter and online are not the same as the ones we can prescribe.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          { kind: "prose", title: "How Whitening Works", items: [
            { lead: "", body: "Whitening gels contain hydrogen peroxide or carbamide peroxide. They pass through the enamel and break apart the stain molecules trapped in the underlying dentine. The teeth themselves are not damaged or stripped — they’re bleached, in the same way hair is bleached." },
          ]},
          { kind: "numbered", title: "What We Offer", items: [
            { title: "Custom take-home trays.", body: "The most predictable option for most people. We take impressions, make thin trays that fit your teeth exactly, and give you a tube of professional-strength gel. You wear them at home — usually overnight or for an hour a day — for one to two weeks." },
            { title: "In-chair whitening.", body: "A higher-strength gel applied at the practice with the gums protected, in a single appointment of about an hour. Useful before a wedding or event. Often paired with take-home trays for the best long-term result." },
            { title: "Internal whitening (for one dark tooth).", body: "If a single tooth has darkened after a knock or a root canal, we can place gel inside the tooth itself rather than on the outside. Quietly very effective." },
          ]},
          { kind: "prose", title: "What It Will and Won’t Do", items: [
            { lead: "Lifts natural tooth colour.", body: "Two to seven shades is typical. Yellow tones lift more readily than grey ones." },
            { lead: "Won’t change crowns, veneers or fillings.", body: "These materials don’t respond to bleach. If you have white fillings on the front teeth, they may need replacing afterwards to match the new shade." },
            { lead: "Won’t fix grey or banded teeth from tetracycline.", body: "Will lift them, but rarely all the way. Veneers may be the better option — we’ll be honest at the assessment." },
            { lead: "Causes temporary sensitivity in some people.", body: "Cold-air or sweet-taste sensitivity for a day or two is common, particularly with stronger gels. We can adjust the strength or wear time, and sensitive-toothpaste before and during whitening helps." },
          ]},
        ],
        callout: { title: "It has to be a dentist", body: "It is illegal in the UK for anyone other than a registered dental professional to whiten teeth. Salons and beauticians offering whitening are breaking the law, and the gels sold online from outside the EU are often far stronger than the limit considered safe — they can burn gums and damage enamel." },
        notice: { title: "Whitening toothpastes", body: "“Whitening” toothpastes don’t bleach teeth — they’re just more abrasive. They can shift surface staining from coffee or red wine, but they can’t lift the underlying colour, and the more abrasive ones wear enamel down over time. They aren’t a substitute." },
      },
      {
        eyebrow: "Aftercare & Habits",
        pageTitle: "Looking After a Whiter Smile",
        intro: "How long the result lasts depends mostly on what you eat and drink in the first two weeks, and on how you look after the trays for top-ups later.",
        sections: [
          { kind: "list", title: "The First 48 Hours", items: [
            { title: "Avoid anything that would stain a white shirt.", tag: "48 HOURS", body: "Coffee, tea, red wine, curry, tomato sauce, beetroot, soy sauce, berries. The teeth are temporarily more porous and pick up colour easily." },
            { title: "No smoking or vaping.", tag: "48 HOURS", body: "Tar stains a freshly whitened tooth almost immediately." },
            { title: "Use a sensitive toothpaste.", tag: "2 WEEKS", body: "Sensodyne or Colgate Sensitive Pro-Relief, twice a day. Can also be smeared inside the tray and worn for ten minutes if a tooth is sore." },
          ]},
          { kind: "compare", title: "Friendly & Less Friendly",
            left:  { title: "Helps the result last", items: [
              "Drink staining drinks through a straw.",
              "Rinse with water after coffee, tea or wine.",
              "Brush twice a day and clean between the teeth daily.",
              "Keep regular hygienist visits to remove surface stain.",
              "Keep your trays — a single top-up night, once or twice a year, holds the colour.",
            ]},
            right: { title: "Shortens the result", items: [
              "Smoking, vaping and chewing tobacco.",
              "Sipping coffee, tea or red wine through the day.",
              "Strongly coloured mouthwashes — chlorhexidine in particular.",
              "Whitening kits bought online from outside the UK.",
            ]},
          },
          { kind: "list", title: "Top-Ups", items: [
            { title: "Keep the trays in their case.", tag: "ALWAYS", body: "Out of direct sunlight and away from hot water — both warp the plastic. Rinse them in cold water after use." },
            { title: "Order top-up gel from us, not online.", tag: "YEARLY", body: "The strength and pH are matched to your trays and your sensitivity. Online gels often have neither." },
            { title: "One or two nights twice a year is usually enough.", tag: "AS NEEDED", body: "Most people don’t need a full course again. A short top-up brings the colour back." },
          ]},
        ],
        noticeBox: { title: "Ring the practice if you notice:", items: [
          "Sharp tooth pain that doesn’t settle within a day or two of stopping the gel.",
          "White or red patches on the gum that don’t go away after 24 hours.",
          "One tooth staying noticeably darker than the others — it may need internal whitening.",
          "A front filling or crown that no longer matches the new shade.",
        ]},
      },
    ],
  },

  /* ─── 21 · Understanding Gum Disease ──────────────────────────────────── */
  {
    id: "gum-disease",
    num: "21",
    ref: "PI-PER-01",
    category: "gum",
    title: "Understanding Gum Disease",
    summary: "The two stages, the warning signs, and the heart-health link.",
    intro:
      "Gum disease is the leading cause of tooth loss in adults — yet because it is often painless in the early stages, most people don’t realise they have it. Spotting the signs early is the single most important thing you can do to protect your smile.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          { kind: "numbered", title: "The Two Stages", items: [
            { title: "Gingivitis — the reversible stage", body: "Plaque sits along the gumline and the gums become red, puffy and bleed easily during brushing or flossing. The good news: at this stage the damage hasn’t reached the bone, and gingivitis is almost always reversible with a professional clean and better home care." },
            { title: "Periodontitis — the advanced stage", body: "Untreated, the gum begins to pull away from the tooth, forming “pockets” that fill with bacteria. The body’s response gradually breaks down the bone and ligaments that hold the teeth in place. Periodontitis cannot be reversed, but it can be stopped. The earlier we treat it, the more tooth and bone we keep." },
          ]},
          { kind: "prose", title: "Warning Signs to Watch For", items: [
            { lead: "Bleeding gums.", body: "Bleeding when you brush or floss is the earliest and most reliable warning sign. Healthy gums do not bleed." },
            { lead: "Persistent bad breath.", body: "A lingering bad taste or odour that doesn’t shift after brushing is often caused by bacteria in deep gum pockets." },
            { lead: "Receding gums.", body: "Teeth that look “longer” than they used to, or feel newly sensitive at the gumline." },
            { lead: "Loose or drifting teeth.", body: "A tooth that feels mobile, or a bite that subtly changes, is a sign the supporting bone is being lost." },
            { lead: "Red, swollen, tender gums.", body: "Healthy gums are firm and pale pink. Anything else is worth a check." },
          ]},
          { kind: "prose", title: "What Raises Your Risk", intro: "Plaque build-up from inadequate brushing and flossing is the primary cause — but several other factors can tip the balance toward disease, even in people with good hygiene.", items: [
            { lead: "Smoking and vaping.", body: "Smokers are up to three times more likely to develop severe gum disease, and treatment is less predictable until they stop." },
            { lead: "Diabetes.", body: "Poorly controlled blood sugar fuels gum infection — and gum infection makes blood sugar harder to control. The two are closely linked." },
            { lead: "Genetics.", body: "Around 30% of people have a hereditary tendency to gum disease and need closer monitoring even with great home care." },
            { lead: "Stress, hormones & medication.", body: "Pregnancy, menopause, certain blood-pressure drugs and stress all affect gum health." },
          ]},
        ],
        callout: { title: "The heart-health connection", body: "A growing body of research links gum disease to heart disease, stroke, type 2 diabetes and complications in pregnancy. Inflammation in the mouth can affect the rest of the body — looking after your gums is part of looking after the rest of you." },
        notice: { title: "Don’t wait for pain", body: "Gum disease rarely hurts until it is advanced. If you’ve noticed bleeding, bad breath or any of the warning signs above — even mildly — please book a periodontal assessment. Catching it early makes treatment much simpler." },
      },
      {
        eyebrow: "Treatment & Self-Care",
        pageTitle: "How We Treat & Manage Gum Disease",
        intro: "Treating gum disease is a partnership: thorough cleaning by us, and a consistent daily routine from you. Done together, even moderate periodontitis can be brought under control and kept stable for life.",
        sections: [
          { kind: "list", title: "Your Treatment Pathway", items: [
            { title: "1. Periodontal assessment.", tag: "VISIT 1", body: "We measure the depth of the gum pockets around every tooth, check for bleeding, and review X-rays to see the bone level. This gives us your starting baseline." },
            { title: "2. Scaling — cleaning above the gumline.", tag: "VISIT 1–2", body: "We remove hardened plaque (tartar) from the visible surfaces of the teeth using ultrasonic and hand instruments." },
            { title: "3. Root surface debridement — deep cleaning.", tag: "VISIT 2–3", body: "For deeper pockets we numb the area and gently clean the root surfaces below the gumline, removing the bacteria that are driving the disease and smoothing the root so the gum can reattach." },
            { title: "4. Re-evaluation.", tag: "8–12 WEEKS LATER", body: "We re-measure the pockets to see how the gums have healed. Most pockets shrink; any that remain deep may benefit from further treatment." },
            { title: "5. Supportive maintenance.", tag: "EVERY 3–4 MONTHS", body: "Regular maintenance cleans every 3–4 months are the best predictor of long-term success. Stretching to 6 months is when relapses happen." },
          ]},
          { kind: "compare", title: "Your Daily Routine",
            left:  { title: "Do", items: [
              "Brush twice a day for two minutes with a fluoride toothpaste — an electric brush is significantly more effective.",
              "Clean between every tooth, every day, with floss or interdental brushes.",
              "Spit the toothpaste out rather than rinsing, so the fluoride stays on the teeth.",
              "If you smoke, ask us about stopping — your gums respond noticeably better within a few weeks.",
              "Tell your GP about your gum diagnosis if you have diabetes or heart conditions.",
            ]},
            right: { title: "Avoid", items: [
              "Stopping when the bleeding stops — it means it’s working, not that you’re done.",
              "Brushing harder — it damages gums; thoroughness beats pressure.",
              "Skipping flossing or interdental brushes — brushing alone misses 40% of tooth surfaces.",
              "Frequent sugary or acidic snacks and drinks throughout the day.",
              "Stretching maintenance visits to 6 months — disease quietly returns.",
            ]},
          },
          { kind: "list", title: "After a Deep Clean: What to Expect", items: [
            { title: "Mild tenderness for a few days.", tag: "FIRST 3–5 DAYS", body: "Gums often feel sore and may bleed a little. A warm salt-water rinse and an over-the-counter painkiller usually settle it." },
            { title: "Temporary sensitivity to hot and cold.", tag: "2–6 WEEKS", body: "Roots that were covered by inflamed gum are briefly exposed as the gum tightens. A sensitivity toothpaste used twice daily helps." },
            { title: "Teeth may look slightly longer.", tag: "PERMANENT", body: "This is the gum returning to its true, healthier position — not further recession." },
          ]},
        ],
        noticeBox: { title: "Call the practice if you notice:", items: [
          "Bleeding that doesn’t settle within a few days of a deep clean.",
          "Increasing pain, swelling or a bad taste — possible signs of infection.",
          "A tooth that feels suddenly more loose, or a bite that has changed.",
          "An abscess, lump or pus around a tooth or gum.",
        ]},
      },
    ],
  },

  /* ─── 06 · Children's Dental Health · 6 to 12 ─────────────────────────── */
  {
    id: "children-6-12",
    num: "06",
    ref: "PI-C612-01",
    category: "children",
    title: "Children's Dental Health · 6 to 12",
    summary: "Mixed-dentition years — the decade that sets up an adult mouth.",
    intro: "These are the mixed-dentition years — baby teeth and adult teeth in the mouth at the same time. It is the period that sets up an adult mouth, and the most common time we see decay in adult teeth that has happened in the first few years they're out.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          { kind: "numbered", title: "What's Happening at This Age", items: [
            { title: "The first adult molars come through.", body: "Around age 6, four \"six-year molars\" appear right at the back — behind the baby teeth, no baby tooth falls out first. Easy to miss. They are the most decay-prone teeth in the mouth." },
            { title: "Front teeth wobble and swap over.", body: "Lower fronts first, around age 6–7, then upper fronts. The new adult teeth often look bigger, more yellow and a bit crooked at first — all normal. Wait before worrying about straightening." },
            { title: "Premolars and canines arrive.", body: "Roughly age 9–12. Spaces close, the bite changes, and any patterns set now (grinding, mouth-breathing, thumb-sucking) start to shape how the adult teeth sit." },
            { title: "Second adult molars (12-year molars).", body: "Behind the first ones, around age 12. Fissure sealants on these and the 6-year molars are one of the highest-impact things we do for children." },
          ]},
          { kind: "prose", title: "Brushing at This Age", items: [
            { lead: "Supervise until at least age 7.", body: "Until they can write neatly, they can't brush thoroughly. Stand behind them, do the back teeth and the inside of the lower fronts yourself. They can do the showy bits." },
            { lead: "Adult-strength fluoride toothpaste.", body: "From age 6, use 1350–1500 ppm fluoride toothpaste — the standard adult kind. Pea-sized amount. Children's toothpastes are too weak from this age." },
            { lead: "Spit, don't rinse.", body: "Lets the fluoride keep working. Most children aren't taught this — it's a big lever." },
            { lead: "Electric brush from around 7–8.", body: "If they'll use one, they cover more surface and brush longer. Two minutes, twice a day." },
            { lead: "Start cleaning between the teeth as the back teeth touch.", body: "Small interdental brushes or floss-on-a-stick work better than spool floss for children." },
          ]},
        ],
        callout: { title: "Sealants and fluoride varnish", body: "The two most useful preventive treatments for this age group. We can paint a hard plastic seal over the deep grooves of the new adult molars, and a quick fluoride varnish twice a year cuts decay risk significantly. Both are quick, painless, and on the NHS for children. See our Fissure Sealants leaflet." },
        notice: { title: "Don't worry if…", body: "New adult front teeth look more yellow than the baby teeth (they're meant to). They look big in a small face — they'll fit. They come through crooked or rotated — they often straighten as more teeth arrive. A baby tooth is wobbly for weeks before it falls out. We'll let you know if anything actually needs intervening with." },
      },
      {
        eyebrow: "Everyday Habits",
        pageTitle: "Day-to-Day for 6–12s",
        intro: "Three things move the needle most: a steady brushing routine, sugar at meals rather than between them, and the right protection for sport. Everything else is icing.",
        sections: [
          { kind: "list", title: "Lunchboxes & Snacks", items: [
            { title: "Sweets at mealtimes, not between.", tag: "DAILY", body: "Frequency matters more than amount. One pudding after dinner is much better than the same sweets spread across the afternoon." },
            { title: "Water in the lunchbox.", tag: "DAILY", body: "Squashes, juice and flavoured waters are acidic and decay-promoting even when sugar-free. Plain water or milk only." },
            { title: "Watch for sticky \"healthy\" snacks.", tag: "DAILY", body: "Dried fruit, fruit yoghurts, fruit bars, oat bars — all stick around in the grooves of the back teeth and feed decay." },
            { title: "Cheese, breadsticks, crunchy veg.", tag: "ANYTIME", body: "Tooth-friendly snack options." },
          ]},
          { kind: "compare", title: "Sport & Habits",
            left:  { title: "Worth doing", items: [
              "Custom mouthguard for any contact sport — football, rugby, hockey, martial arts, skateboarding.",
              "Bringing them along for routine check-ups every 6 months — the visit becomes the normal thing.",
              "Seeing us at the first sign of crowding or a bite issue — referrals for orthodontics start around age 11–12.",
            ]},
            right: { title: "Worth watching", items: [
              "Energy and sports drinks — high acid plus high sugar.",
              "Mouth-breathing or snoring — worth flagging at a check-up.",
              "Nail-biting and pencil-chewing — chip risk.",
              "Whitening kits and fashion grills — please not at this age.",
            ]},
          },
        ],
        noticeBox: { title: "Ring the practice if:", items: [
          "An adult tooth is knocked out — see our Emergencies leaflet, this is a same-day call.",
          "A baby tooth has been wobbly for over three months and isn't coming out, or a permanent tooth seems stuck.",
          "You can see a hole, dark mark or white patch on a back tooth.",
          "Your child complains of pain that wakes them at night, or pain to hot drinks.",
          "A new adult tooth is coming through behind the baby tooth (\"shark teeth\").",
        ]},
      },
    ],
  },

  /* ─── 07 · Teenagers & Their Teeth ────────────────────────────────────── */
  {
    id: "teenagers",
    num: "07",
    ref: "PI-TEN-01",
    category: "children",
    title: "Teenagers & Their Teeth",
    summary: "Energy drinks, vaping, braces — the habits that shape an adult mouth.",
    intro: "The teenage years are when the adult dentition is finally complete and habits formed for life. They are also when we see the most damage we hadn't expected — from energy drinks, vaping and braces that aren't being kept clean.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          { kind: "numbered", title: "The Big Risks at This Age", items: [
            { title: "Energy and sports drinks.", body: "Red Bull, Monster, Lucozade Sport. High sugar plus high acid, and usually sipped over an hour or two — exactly the worst pattern. We see distinctive enamel erosion on the front teeth in teens who drink them daily." },
            { title: "Vaping.", body: "Not harmless. Causes dry mouth, gum recession, and irritation of the soft tissues. High-nicotine pods raise the risk of gum disease in the long run." },
            { title: "Brace cleaning.", body: "Fixed braces double the surfaces plaque can collect on. The most common decay we see in teens is white scarring around brackets — permanent, and entirely preventable." },
            { title: "Wisdom teeth coming through.", body: "From around age 16. Sore gums, swelling, sometimes infection (pericoronitis). See our Wisdom Teeth leaflet." },
          ]},
          { kind: "prose", title: "Things to Be Aware Of", items: [
            { lead: "Mouth piercings.", body: "Tongue and lip piercings chip front teeth and recede gums. The damage is gradual and irreversible. Worth talking through before, not after." },
            { lead: "Whitening kits and fashion grills.", body: "Online whitening kits and shop-bought trays often contain too much peroxide and damage gums. Avoid until 18, then come and see us." },
            { lead: "Sports injuries.", body: "A custom mouthguard for any contact sport. Boil-and-bite ones bought from sports shops give limited protection." },
            { lead: "Eating-disorder signs.", body: "Erosion on the inside of the front teeth is a quiet early sign of repeated vomiting. We treat what we see in confidence and can refer for help." },
          ]},
        ],
        callout: { title: "The habits set now", body: "Adults whose mouths are still healthy in their 50s overwhelmingly brush twice a day, clean between their teeth and don't snack constantly. Adults who lose teeth early overwhelmingly don't. The habits established at 14 stick. This is the single highest-leverage decade in a person's dental life." },
        notice: { title: "Coming without a parent", body: "From 16 onwards, teens can attend on their own and we are happy to talk to them privately. Some things they will discuss with us they may not raise at home. Anything they tell us is in confidence (with the usual safeguarding exceptions). We treat them as adults from that age." },
      },
      {
        eyebrow: "Everyday Habits",
        pageTitle: "The Routine That Holds",
        intro: "Five things, all of them five-minute jobs. Done daily, they prevent almost everything we see in teenage mouths.",
        sections: [
          { kind: "list", title: "Daily", items: [
            { title: "Brush twice a day, two minutes each.", tag: "MORNING & NIGHT", body: "Electric brush, fluoride toothpaste (1450 ppm). Spit, don't rinse. Set a timer if needed — most people brush for nowhere near two minutes." },
            { title: "Clean between the teeth.", tag: "ONCE A DAY", body: "Interdental brushes if there's space, floss-on-a-stick if not. Around brackets — superfloss or a water flosser." },
            { title: "A fluoride mouthwash, separately from brushing.", tag: "ONCE A DAY", body: "Useful for brace-wearers and high-risk teens. Use it at a different time of day from brushing — both at once washes the toothpaste off." },
            { title: "Drink water with meals.", tag: "DAILY", body: "Squashes, juice, sports drinks and energy drinks at mealtimes only — never sipped through the afternoon." },
          ]},
          { kind: "compare", title: "Helpful & Less Helpful",
            left:  { title: "Worth doing", items: [
              "Custom sports mouthguard.",
              "Coming for check-ups every 6 months — twice as often during orthodontics.",
              "Sugar-free gum after meals (helps with dry mouth and braces).",
              "Asking about whitening properly, when you're old enough.",
            ]},
            right: { title: "Worth skipping", items: [
              "Energy drinks and sports drinks as everyday hydration.",
              "Vapes (NHS treats them as a stop-smoking aid, not a habit).",
              "TikTok \"DIY straightening\" and online whitening kits.",
              "Tongue and lip piercings on permanent teeth.",
            ]},
          },
        ],
        noticeBox: { title: "Talk to us about:", items: [
          "Crooked or crowded teeth — orthodontic referrals are usually made between ages 11 and 14.",
          "Wisdom teeth coming through with sore or swollen gums.",
          "Sensitivity, white patches around braces, or bleeding gums that don't settle.",
          "Anything that has been worrying you that you'd rather not raise at home — we are happy to talk privately.",
        ]},
      },
    ],
  },

  /* ─── 08 · Thumb-Sucking & Dummy Habits ───────────────────────────────── */
  {
    id: "thumb-sucking",
    num: "08",
    ref: "PI-THM-01",
    category: "children",
    title: "Thumb-Sucking & Dummy Habits",
    summary: "When to leave it alone, when to gently help it stop.",
    intro: "Thumb-sucking and dummies soothe babies and toddlers and that's a good thing. It's only when the habit carries on past the age the adult teeth start coming through that we begin to worry about it shaping the bite.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          { kind: "numbered", title: "The Age It Stops Mattering", items: [
            { title: "Up to age 2.", body: "Genuinely no concern. Most children self-soothe this way." },
            { title: "Ages 2–4.", body: "The right window to start gently encouraging them to stop, particularly during the day. The mouth still recovers easily." },
            { title: "Age 4 onwards.", body: "Adult front teeth start arriving around 6. A habit that continues into school years can shape how they come through." },
            { title: "Beyond 7.", body: "The bite changes are likely to need orthodontic correction later. Worth working harder on stopping." },
          ]},
          { kind: "prose", title: "What It Can Do to the Bite", items: [
            { lead: "An open bite at the front.", body: "Upper and lower front teeth no longer meet — there's a thumb-shaped gap between them. Affects biting into food and certain speech sounds." },
            { lead: "Front teeth pushed forward.", body: "The thumb sits behind the upper teeth and pushes them out. Lower teeth tilt back to compensate." },
            { lead: "A narrower upper jaw.", body: "The cheeks sucking in pull the upper arch inwards over time, leading to a crossbite." },
            { lead: "Speech sounds.", body: "Lisping on \"s\" and \"th\" is common in long-term thumb-suckers — and can persist after the habit stops if the bite has changed." },
          ]},
        ],
        callout: { title: "Don't make a battle of it", body: "Pressure, scolding and shame rarely work and often make the habit stronger. The thumb is what the child reaches for when they're anxious — and being told off for it adds anxiety. The strategies on the next page work better, particularly when the child themselves wants to stop." },
        notice: { title: "Dummies vs thumbs", body: "The bite changes from a dummy are often less severe than from a thumb (the thumb is harder, sucked more forcefully and for longer). Dummies are also easier to take away. From around 12 months, ration the dummy to sleep times only; aim to be off it altogether by age 2." },
      },
      {
        eyebrow: "Stopping Gently",
        pageTitle: "Helping Them Stop",
        intro: "The most successful approach is one the child is on board with. Below are strategies that work, ordered roughly by age.",
        sections: [
          { kind: "list", title: "For Younger Children", items: [
            { title: "Distract during the day.", tag: "WHENEVER YOU SPOT IT", body: "A toy in their hand, a song, a question. Re-route, don't comment." },
            { title: "Address the trigger.", tag: "AS NEEDED", body: "Tired? Bored? Worried about something? Sucking is the symptom — comfort the cause." },
            { title: "Praise without overdoing it.", tag: "WHEN THEY GO WITHOUT", body: "\"I noticed your thumb stayed in your lap during the story\" is more effective than gold stars." },
          ]},
          { kind: "list", title: "For School-Age Children", items: [
            { title: "Get them onside.", tag: "FIRST", body: "Show them in the mirror what their teeth are doing. Explain you'll help them, not punish them. Their decision to stop is what makes it stick." },
            { title: "A reward chart for night-time.", tag: "2–4 WEEKS", body: "Small daily reward for waking up without the thumb, larger weekly one. Keep it specific." },
            { title: "A reminder on the thumb at night.", tag: "2–3 WEEKS", body: "A plaster, a sock taped over the hand, or a bitter-tasting nail varnish from the pharmacy. Works as a prompt — they pull the thumb out themselves." },
            { title: "Talk to us if it's persistent.", tag: "IF STILL GOING AT 7+", body: "For determined cases, a small dental appliance — a habit-breaker — fits behind the upper front teeth and gently disrupts the comfort of the thumb. Worn for 3–6 months." },
          ]},
          { kind: "compare", title: "Helps & Doesn't",
            left:  { title: "Helps", items: [
              "Picking a moment when life is settled — not a new sibling or a house move.",
              "Tackling night-time after daytime is gone.",
              "Patience — most children stop entirely within 4–6 weeks once they're on board.",
              "Bringing them to a check-up so we can encourage them in person.",
            ]},
            right: { title: "Doesn't work", items: [
              "Shouting, shaming or telling them off.",
              "Yanking the thumb out at night.",
              "Trying to stop during a stressful period in family life.",
              "Worrying before age 4. It's genuinely fine.",
            ]},
          },
        ],
        noticeBox: { title: "Talk to us if:", items: [
          "The habit is still going at age 6–7.",
          "You can already see the front teeth being pushed forward or an open bite developing.",
          "Speech is being affected and a speech-and-language therapist is involved.",
          "You'd like a habit-breaker appliance — we'll talk through whether it's the right time.",
        ]},
      },
    ],
  },

  /* ─── 10 · White (Composite) Fillings ─────────────────────────────────── */
  {
    id: "white-fillings",
    num: "10",
    ref: "PI-WFL-01",
    category: "cosmetic",
    title: "White (Composite) Fillings",
    summary: "How they compare to silver, what to expect, and how long they last.",
    intro: "White fillings are made from a tooth-coloured resin that is placed in soft layers, shaped to match the tooth, and set hard with a blue light. They bond directly to the tooth, so we can keep more of the natural tooth than with older silver fillings.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          { kind: "prose", title: "How They Compare to Silver Fillings", items: [
            { lead: "They bond to the tooth.", body: "Silver (amalgam) fillings sit in a hole shaped to grip them. Composite is glued in place, so we can prepare a smaller, more conservative cavity." },
            { lead: "They look like a tooth.", body: "Shaded to match the surrounding enamel. Almost invisible at conversational distance." },
            { lead: "They take longer to place.", body: "The tooth has to be kept dry and the layers are built up one at a time. Expect a slightly longer appointment than for an amalgam." },
            { lead: "They cost more.", body: "Reflecting the time and the materials. On the NHS, white fillings are routinely available for front teeth; for back teeth they are usually a private option." },
          ]},
          { kind: "numbered", title: "What to Expect at the Appointment", items: [
            { title: "Numbing.", body: "A small amount of numbing gel, then a local anaesthetic injection. Most fillings need this; very small ones sometimes don't." },
            { title: "Removing the decay.", body: "The drill removes only the soft, decayed tooth — modern composites let us be conservative." },
            { title: "Bonding and building up.", body: "An etch and a bond are applied, then composite is placed in thin layers and set hard with the blue light." },
            { title: "Shaping and polishing.", body: "We adjust the bite and polish the surface so it feels natural." },
          ]},
          { kind: "prose", title: "How Long They Last", items: [
            { lead: "", body: "On a small to medium cavity in someone who looks after their teeth, a composite filling typically lasts seven to ten years, often longer. Larger fillings, fillings on back teeth, and fillings in someone who grinds will not last as long. We can usually repair rather than replace when one wears or chips at the edge." },
          ]},
        ],
        callout: { title: "Repair where we can", body: "One of the quiet advantages of composite is that small chips and worn edges can be added to without redoing the whole filling. The tooth keeps more of its structure each time, which is the long game we're playing." },
        notice: { title: "Replacing old silver fillings", body: "We don't routinely replace silver fillings just for appearance. They are still a perfectly safe material, and replacing them removes more tooth. We will recommend it if a filling is failing, leaking or has decay underneath — otherwise leaving it alone is usually the kinder option." },
      },
      {
        eyebrow: "Aftercare",
        pageTitle: "After a White Filling",
        intro: "Composite is set hard before you leave the chair, so you can eat as soon as the numbness wears off. A few small things make the filling settle in better.",
        sections: [
          { kind: "list", title: "The First Day", items: [
            { title: "Wait for the numbness.", tag: "2–4 HOURS", body: "Avoid eating until the lip and tongue feel normal — easy to bite either of them by accident." },
            { title: "Eat softer foods to start.", tag: "FIRST EVENING", body: "Not because the filling is fragile, but to let the bite settle and to be gentle on a numb mouth." },
            { title: "Some sensitivity is normal.", tag: "A FEW DAYS", body: "To cold drinks, or biting pressure. Should ease over a week or two." },
          ]},
          { kind: "compare", title: "Looking After the Filling Long-Term",
            left:  { title: "Helps the filling last", items: [
              "Brushing twice a day with fluoride toothpaste.",
              "Cleaning between the teeth daily.",
              "Cutting back on sugary drinks and frequent snacking.",
              "Wearing a nightguard if you grind.",
              "Regular check-ups so we can spot wear at the edges early.",
            ]},
            right: { title: "Shortens its life", items: [
              "Chewing ice, pen lids and hard sweets.",
              "Using teeth as tools (opening packets, biting nails).",
              "Sipping fizzy or sugary drinks all day.",
              "Skipping cleaning between the teeth — decay almost always returns at the edges.",
            ]},
          },
        ],
        noticeBox: { title: "Ring the practice if you notice:", items: [
          "The bite feels high or uneven for more than a day or two — we can adjust it in five minutes.",
          "Sharp pain on biting that doesn't settle within a week.",
          "Lingering pain to cold or sweet things lasting more than a few weeks.",
          "A piece of the filling feels rough, sharp, or has come out.",
        ]},
      },
    ],
  },

  /* ─── 11 · Veneers ────────────────────────────────────────────────────── */
  {
    id: "veneers",
    num: "11",
    ref: "PI-VEN-01",
    category: "cosmetic",
    title: "Veneers",
    summary: "Porcelain vs composite, what they fix, and the permanence question.",
    intro: "A veneer is a thin shell bonded to the front of a tooth — the dental equivalent of a false fingernail. They change the colour, shape or alignment of front teeth without crowning the whole tooth. Done well, they look natural; done lightly, they remove very little tooth.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          { kind: "numbered", title: "Porcelain or Composite", items: [
            { title: "Composite veneers (built up at the chair).", body: "Tooth-coloured resin shaped on directly in a single appointment. Less tooth removed, repairable, more affordable. Lasts about 5–7 years before needing refreshing or replacing." },
            { title: "Porcelain veneers (made in a lab).", body: "Two appointments — preparation and impressions, then fitting two weeks later. A small layer of enamel is removed, and a temporary fitted in between. Stronger, more stain-resistant, more lifelike. Lasts 10–15 years on average." },
            { title: "Minimal-prep porcelain veneers.", body: "For lighter cases — little or no enamel removed, sometimes none at all. Not always possible, depending on what you're trying to change." },
          ]},
          { kind: "prose", title: "What Veneers Are Good At", items: [
            { lead: "Lifting the colour of dark teeth.", body: "Especially teeth that don't respond to whitening." },
            { lead: "Closing small gaps.", body: "Particularly the gap between the upper front teeth." },
            { lead: "Reshaping chipped or worn front edges.", body: "From grinding, age, or a long-ago accident." },
            { lead: "Making mildly crooked teeth look straighter.", body: "Without the time of orthodontics — though for moderate or severe crowding, aligners are usually the better answer." },
          ]},
          { kind: "prose", title: "What Veneers Aren't For", items: [
            { lead: "", body: "Heavily decayed teeth, root-treated front teeth that are very dark, badly broken teeth, or anyone who grinds heavily without wearing a nightguard. We will tell you honestly if a different option (whitening, a crown, alignment) is the better fit. Veneers placed on the wrong tooth come off." },
          ]},
        ],
        callout: { title: "Veneers are permanent", body: "This is the bit patients sometimes don't hear clearly. Once enamel is removed for porcelain veneers, it's gone. The tooth will always need a veneer or crown after that — they can't be reversed back to natural tooth. We talk this through carefully, often with a mock-up of how they will look, before agreeing to start." },
        notice: { title: "Try before you decide", body: "For porcelain veneers we usually do a \"trial smile\" first — a temporary mock-up of the proposed shape and colour bonded onto your existing teeth, so you can see and live with the result for a few days before committing. The single best way to avoid a result you don't love." },
      },
      {
        eyebrow: "Aftercare",
        pageTitle: "Looking After Your Veneers",
        intro: "Veneers don't need any special daily care — but a few simple habits add years to them, and a few bad ones take years off.",
        sections: [
          { kind: "list", title: "Day One", items: [
            { title: "Sensitivity to cold.", tag: "A FEW DAYS", body: "Some sensitivity is normal — settles within a week or two. Sensitive toothpaste helps." },
            { title: "Gum tenderness around the edges.", tag: "A WEEK", body: "The gum settles back over the new shape. Brush gently around the area." },
            { title: "Speech sounds slightly different.", tag: "FEW DAYS", body: "Especially with \"s\" and \"f\" sounds. Brain catches up within a couple of days." },
          ]},
          { kind: "compare", title: "Long-Term Habits",
            left:  { title: "Helps them last", items: [
              "Brushing twice a day, soft brush, gentle pressure.",
              "Cleaning between the teeth daily — decay returns at the edges of veneers, not the surface.",
              "Wearing a nightguard if you grind. Non-negotiable.",
              "Hygienist visits every 6 months.",
            ]},
            right: { title: "Shortens their life", items: [
              "Biting nails, pen lids, ice and hard sweets.",
              "Using teeth as tools (opening packets, biting thread).",
              "Heavy red wine, strong tea, smoking — composite veneers stain over time, porcelain doesn't.",
              "Whitening kits — they won't change the colour of veneers, only the natural teeth around them.",
            ]},
          },
        ],
        noticeBox: { title: "Ring the practice if you notice:", items: [
          "A veneer feels rough at the edge, or has chipped.",
          "A veneer has come off — keep it, dry, in a small container, and ring same-day.",
          "The bite feels uneven or one tooth is hitting first.",
          "A veneer looks darker at the edge or the gum is shrinking back from it.",
        ]},
      },
    ],
  },

  /* ─── 12 · Caring for Your New Crown or Bridge ────────────────────────── */
  {
    id: "crown-bridge",
    num: "12",
    ref: "PI-RES-02",
    category: "cosmetic",
    title: "Caring for Your New Crown or Bridge",
    summary: "What to expect, daily maintenance, and protecting the tooth underneath.",
    intro: "Your new crown or bridge is hard-wearing, but the natural tooth and gum underneath still need looking after. A few small habits in the first weeks, and at every brush from now on, are what make the difference between a restoration that lasts five years and one that lasts twenty.",
    pages: [
      {
        eyebrow: "Patient Information Sheet",
        sections: [
          { kind: "numbered", title: "What to Expect Initially", items: [
            { title: "The \"new\" feeling.", body: "It is normal for your new restoration to feel slightly different or \"large\" for the first few days while your tongue and cheeks adjust." },
            { title: "Sensitivity.", body: "You may experience mild sensitivity to hot or cold temperatures. This usually subsides within a week." },
            { title: "Bite adjustment.", body: "If your bite feels \"high\" or uneven after 48 hours, please call us for a simple adjustment." },
          ]},
          { kind: "prose", title: "Daily Maintenance", items: [
            { lead: "Brushing.", body: "Brush twice daily with fluoride toothpaste, paying extra attention to the margin — where the crown meets the gumline — to prevent decay." },
            { lead: "Flossing bridges.", body: "For a dental bridge, use a \"bridge needle\" or \"super floss\" to clean under the artificial tooth (pontic), where food particles can trap." },
            { lead: "Flossing crowns.", body: "Floss around your crown daily. Instead of pulling the floss back up through the contact, slide it out sideways to avoid catching the edge of the crown." },
          ]},
          { kind: "prose", title: "Protecting Your Investment", items: [
            { lead: "Avoid hard objects.", body: "Do not chew ice, hard candy, or pens — these can chip the porcelain, much like a natural tooth." },
            { lead: "Night guards.", body: "If you have a habit of grinding your teeth (bruxism), we strongly recommend a custom mouthguard to protect the restoration from excessive pressure." },
            { lead: "Regular check-ups.", body: "Visit us every 6 months so we can monitor the integrity of the seal and the health of the underlying tooth." },
          ]},
        ],
        callout: { title: "The tooth underneath", body: "The crown itself cannot decay, but the tooth underneath it can. Most crown failures we see are caused by decay sneaking in at the gumline, not by the crown breaking. Keep that margin clean and the rest tends to look after itself." },
        notice: { title: "Note to patient", body: "If your bite still feels uneven after 48 hours, or if the crown or bridge feels loose at any time, please contact the Practice promptly." },
      },
      {
        eyebrow: "Aftercare",
        pageTitle: "Your Crown & Bridge Care Checklist",
        intro: "Use this checklist to build good habits in the first few weeks after fitting. With consistent care at the gumline, a well-made crown or bridge can last for many years.",
        sections: [
          { kind: "list", title: "The First Week", items: [
            { title: "Eat softer foods on the restored side.", tag: "DAYS 1–3", body: "Give the cement and surrounding gum tissue time to settle before testing it on harder foods." },
            { title: "Note any hot/cold sensitivity.", tag: "FIRST WEEK", body: "Mild sensitivity is normal and usually fades. Persistent or sharp pain is not — call us." },
            { title: "Check your bite at 48 hours.", tag: "AFTER 2 DAYS", body: "If anything feels \"high\" or uneven when you close your teeth, book a quick adjustment." },
            { title: "Resume normal brushing.", tag: "FROM DAY 1" },
          ]},
          { kind: "compare", title: "Day-to-Day: Do & Avoid",
            left:  { title: "Do", items: [
              "Brush twice daily with fluoride toothpaste, focusing at the gumline.",
              "Floss daily — slide sideways out of crown contacts, don't snap up.",
              "Use a bridge needle or super floss under bridge pontics.",
              "Wear your night guard if you grind or clench your teeth.",
              "Attend a check-up every 6 months.",
            ]},
            right: { title: "Avoid", items: [
              "Chewing ice, hard candy, pens, or fingernails — porcelain can chip.",
              "Sticky toffees, caramels, and chewing gum on the restoration.",
              "Using your teeth as tools to open packets or bottles.",
              "Skipping flossing — decay starts at the margin, not on the crown itself.",
            ]},
          },
        ],
        noticeBox: { title: "Call the practice if you notice:", items: [
          "The crown or bridge feels loose, lifts, or comes off.",
          "A persistent \"high\" bite after 48 hours.",
          "Sharp or lingering pain when biting or with hot/cold.",
          "Bleeding, swelling, or a bad taste at the gumline.",
          "A visible chip or crack in the porcelain.",
        ]},
      },
    ],
  },

  /* ─── 13 · Dental Implants ────────────────────────────────────────────── */
  {
    id: "implants",
    num: "13",
    ref: "PI-IMP-01",
    category: "cosmetic",
    title: "Dental Implants",
    summary: "How implants work, who they suit, and how to look after them.",
    intro: "An implant is a titanium screw that takes the place of a missing tooth root. Once the bone has grown onto it, we fit a crown on top. Done well, it looks and works like a natural tooth, and it doesn't involve drilling down the teeth on either side.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          { kind: "numbered", title: "The Three Parts", items: [
            { title: "The implant.", body: "A small titanium screw, placed in the jawbone where the root used to be. The bone slowly grows onto its surface — a process called osseointegration — usually over three to four months." },
            { title: "The abutment.", body: "A small connector that screws into the implant once it has integrated. The crown sits on top of this." },
            { title: "The crown.", body: "A custom-made tooth, usually porcelain, that screws or cements onto the abutment. This is the part you see and chew with." },
          ]},
          { kind: "prose", title: "What the Process Looks Like", items: [
            { lead: "Assessment.", body: "A consultation, X-rays and usually a 3D scan (CBCT) so we can plan precisely where the implant will sit." },
            { lead: "Placement.", body: "A short surgical appointment, usually under local anaesthetic. Most people are surprised how comfortable it is — more comparable to an extraction than a major operation." },
            { lead: "Healing.", body: "Three to four months of integration. You eat and live as normal, often with a temporary tooth in place. The bone needs this time." },
            { lead: "Fitting the crown.", body: "Two to three short visits to take impressions and fit the final crown." },
          ]},
          { kind: "prose", title: "Who Implants Suit", items: [
            { lead: "Adults with healthy gums and enough bone.", body: "If bone has been lost, a graft can rebuild it before placement. We will tell you honestly if it is feasible." },
            { lead: "Single tooth gaps, multiple gaps or full arches.", body: "From one missing tooth to a full arch on four or six implants. Removable dentures can also be made stable by clipping onto two or four implants." },
            { lead: "Not usually for under-18s.", body: "The jaws are still growing. We wait until growth has finished, often into the early twenties for some people." },
          ]},
        ],
        callout: { title: "Smoking, diabetes & implants", body: "Smoking interferes with bone healing and noticeably raises the chance of implant failure, particularly in the upper jaw. Uncontrolled diabetes does similar. Neither rules implants out, but we'll usually ask you to stop smoking for at least a week before and eight weeks after, and to have your blood-sugar control as good as you can." },
        notice: { title: "How long do they last?", body: "A well-placed implant in healthy bone, in a non-smoker who looks after their gums, has a very high chance of still being there 10–20 years later. The crown on top may need replacing eventually — much like any other crown." },
      },
      {
        eyebrow: "Aftercare & Habits",
        pageTitle: "After Implant Surgery",
        intro: "Looking after the area properly in the first two weeks is what makes the biggest difference to how well the implant integrates. None of it is complicated.",
        sections: [
          { kind: "list", title: "The First 24 Hours", items: [
            { title: "Bite gently on the gauze.", tag: "30 MINS", body: "Some oozing is normal for the first day. Replace the gauze if it soaks through." },
            { title: "Ice pack on the cheek.", tag: "FIRST 4 HOURS", body: "Twenty minutes on, twenty off. Reduces swelling." },
            { title: "Soft, cool food and plenty of water.", tag: "DAY 1", body: "Yoghurt, soup, smoothies, scrambled egg. Avoid hot drinks." },
            { title: "No smoking, no rinsing, no spitting.", tag: "24 HOURS", body: "All three disturb the clot and slow healing." },
          ]},
          { kind: "list", title: "Days 2–14", items: [
            { title: "Warm salt-water rinses, gently.", tag: "3× A DAY", body: "A teaspoon of salt in a mug of warm water, after meals. Don't swill — let it sit and tip out." },
            { title: "Brush carefully around the area.", tag: "FROM DAY 2", body: "Use the soft brush we'll have given you. Keep brushing the rest of your mouth as normal." },
            { title: "Soft food for a week.", tag: "7 DAYS", body: "Avoid chewing directly on the implant site until your review appointment." },
            { title: "Painkillers as needed.", tag: "FIRST FEW DAYS", body: "Paracetamol and ibuprofen together work well unless you've been advised otherwise." },
          ]},
          { kind: "compare", title: "Long-Term Care",
            left:  { title: "Helps the implant last", items: [
              "Brushing twice a day, including around the implant.",
              "Cleaning between the teeth daily — interdental brushes work best around implants.",
              "Hygienist visits every 3–6 months.",
              "A nightguard if you grind your teeth.",
            ]},
            right: { title: "Risks the implant", items: [
              "Smoking — by far the biggest risk for early failure.",
              "Skipping check-ups — implants can develop their own gum disease (peri-implantitis), often without pain.",
              "Chewing ice, pen lids or hard sweets on the crown.",
              "Whitening — won't damage the implant but won't change the crown either.",
            ]},
          },
        ],
        noticeBox: { title: "Ring the practice if you notice:", items: [
          "Heavy bleeding that doesn't stop after 30 minutes of pressure.",
          "Pain that gets worse after day 3, rather than better.",
          "The implant or crown feeling loose or moving when you bite.",
          "Pus, a bad taste, or gum that bleeds easily around the implant.",
        ]},
      },
    ],
  },

  /* ─── 14 · Dentures: Fitting In ───────────────────────────────────────── */
  {
    id: "dentures",
    num: "14",
    ref: "PI-DEN-01",
    category: "cosmetic",
    title: "Dentures: Fitting In",
    summary: "What the first few weeks feel like — and the daily care that follows.",
    intro: "New dentures take some getting used to. They will feel bulky, your speech will sound odd to you, and eating is awkward at first. Almost everyone settles in within a month — and most are surprised by how natural it eventually feels.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          { kind: "numbered", title: "What to Expect", items: [
            { title: "The first week.", body: "The denture feels too big, you'll produce a lot of saliva, and a couple of sore spots are likely. Stick with it. We'll see you back to ease the pressure points — that's a normal part of fitting, not a sign of a bad denture." },
            { title: "Weeks 2–3.", body: "Speech improves. Reading aloud at home helps the brain learn the new shape. Eating is still cautious — small pieces, both sides at once, slowly." },
            { title: "Weeks 4–6.", body: "Most people are eating normally apart from the very chewy or sticky things. The denture starts to feel like part of the mouth." },
            { title: "Beyond 6 weeks.", body: "If something still doesn't feel right — clicking, slipping, persistent soreness — please come back. Small adjustments fix most of it." },
          ]},
          { kind: "prose", title: "Eating with New Dentures", items: [
            { lead: "Start soft, cut small.", body: "Soup, scrambled egg, mashed potato, fish, well-cooked pasta. Cut everything into pea-sized pieces." },
            { lead: "Chew on both sides at once.", body: "Stops the denture from tipping. Counter-intuitive but transforms eating." },
            { lead: "Avoid biting with the front teeth.", body: "Tear food with hands rather than biting an apple or sandwich whole. This habit comes back over time." },
            { lead: "Sticky food first.", body: "Toffee, chewing gum, dried fruit, white sliced bread — these stay difficult longest. Add them back last." },
          ]},
        ],
        callout: { title: "Sore spots are normal", body: "A new denture almost always rubs in one or two places. We can ease the pressure in five minutes if you bring the denture in. Resist the urge to file or sandpaper it yourself — it's easy to ruin the fit. Wear the denture for at least 24 hours before your sore-spot appointment so we can see exactly where it's rubbing." },
        notice: { title: "Speech & the \"sss\" sound", body: "The denture changes the shape of the roof of your mouth, and the brain takes a few days to retune. Read aloud to yourself for 10 minutes a day for the first week — newspapers, recipes, anything. By day 5–7, no one else will notice a difference." },
      },
      {
        eyebrow: "Daily Care",
        pageTitle: "Looking After Dentures",
        intro: "Dentures need cleaning twice a day like teeth, but with different tools. Toothpaste is too abrasive — it scratches the surface and lets bacteria settle.",
        sections: [
          { kind: "list", title: "Daily Routine", items: [
            { title: "Brush the denture morning & night.", tag: "2 MINS EACH", body: "Soft denture brush and plain soap, or a non-abrasive denture cleanser. Over a sink half-filled with water — they break easily if dropped." },
            { title: "Soak overnight.", tag: "EVERY NIGHT", body: "In water or a denture-cleansing solution (Steradent or similar). Never in hot water — it warps the plastic." },
            { title: "Take them out at night.", tag: "EVERY NIGHT", body: "Gives the gums a rest and lets saliva reach them. Sleeping in dentures roughly doubles the risk of oral thrush and gum inflammation." },
            { title: "Brush your gums and tongue.", tag: "TWICE A DAY", body: "With a soft brush, no toothpaste needed. Keeps the mouth healthy and helps the denture fit better." },
            { title: "Clean any remaining teeth as normal.", tag: "TWICE A DAY", body: "Fluoride toothpaste, brush thoroughly — partial-denture wearers are at higher risk of decay on the supporting teeth." },
          ]},
          { kind: "compare", title: "Helps & Less Helpful",
            left:  { title: "Worth doing", items: [
              "Yearly check-ups even if you've no natural teeth — we check the gums, fit, and screen for oral cancer.",
              "Replacing dentures every 5–10 years. Gums change shape underneath; old dentures rock and damage the bone.",
              "Asking us about a \"reline\" if the fit has loosened — often cheaper than a new set.",
              "Considering implants to stabilise a lower denture if it slips badly. Even two implants make a huge difference.",
            ]},
            right: { title: "Best avoided", items: [
              "Toothpaste on dentures — abrasive, leaves micro-scratches.",
              "Hot water and bleach.",
              "Sleeping in them.",
              "Strong adhesive every day to compensate for a poor fit — get the fit checked instead.",
            ]},
          },
        ],
        noticeBox: { title: "Ring the practice if you notice:", items: [
          "A sore spot that hasn't settled within 2–3 days, or any ulcer that hasn't healed after two weeks.",
          "The denture clicks, slips or makes eating awkward after the first 6 weeks.",
          "A red, sore patch on the roof of the mouth (oral thrush is common in denture wearers).",
          "A crack in the denture, or a tooth that has come loose from it — bring the pieces in, don't super-glue at home.",
        ]},
      },
    ],
  },

  /* ─── 15 · Replacing a Missing Tooth ──────────────────────────────────── */
  {
    id: "replace-missing-tooth",
    num: "15",
    ref: "PI-RMT-01",
    category: "cosmetic",
    title: "Replacing a Missing Tooth",
    summary: "Four options compared — implant, bridge, denture, or leaving the gap.",
    intro: "After an extraction or a long-lost tooth, there are usually three sensible options and a fourth which is also legitimate: leave it alone. Each has trade-offs in cost, time, longevity and what it does to the teeth either side.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          { kind: "numbered", title: "The Four Options", items: [
            { title: "Implant.", body: "A titanium screw placed in the bone, restored with a crown a few months later. Doesn't touch the neighbouring teeth. Most lifelike, longest-lasting (often 20+ years). Higher upfront cost; takes 3–6 months from start to finish; not ideal for heavy smokers or uncontrolled diabetes." },
            { title: "Bridge.", body: "A false tooth fused between two crowns that go on the teeth either side. Fixed, looks natural, faster than an implant (2–3 weeks). Downside: the supporting teeth have to be ground down even if they were healthy. Lasts 10–15 years." },
            { title: "Denture (partial).", body: "A removable plate filling the gap. Cheapest, doesn't damage other teeth, can replace several teeth at once. Has to be taken out at night, less stable than the others, takes some getting used to." },
            { title: "Leaving the gap.", body: "A reasonable choice for back teeth, or in older patients, when the gap doesn't affect bite or appearance. Worth knowing the trade-off: teeth either side gradually tip in, the opposite tooth grows down to meet the gap, and chewing efficiency drops on that side." },
          ]},
          { kind: "prose", title: "Choosing Between Them", items: [
            { lead: "A single missing tooth, healthy teeth either side.", body: "An implant is usually the right answer — it preserves the neighbouring teeth." },
            { lead: "A single missing tooth, big fillings or crowns either side.", body: "A bridge can make sense — those teeth needed work anyway." },
            { lead: "Several missing teeth.", body: "A few implants supporting a small bridge, or a partial denture, depending on cost and how many teeth." },
            { lead: "Most or all teeth missing.", body: "Full dentures, or implant-stabilised dentures (two implants in the lower jaw makes a huge difference to a wobbly lower denture)." },
          ]},
        ],
        callout: { title: "What happens if you don't replace it?", body: "For a back molar, often nothing dramatic for years. But over a decade or so the teeth either side tip into the space, the opposite tooth drifts down looking for something to bite against, and food traps build up. The bone where the tooth was also gradually shrinks — which makes any future implant more complicated. Replacing earlier is easier than replacing later." },
        notice: { title: "Time vs cost — a rough guide", body: "Implant: highest cost, longest timeline, longest-lasting. Bridge: middle cost, fastest fixed solution, lasts a decade or so. Partial denture: lowest cost, can be ready in a few weeks, will need replacing every 5–8 years. We'll talk you through the numbers and timelines for your specific situation honestly." },
      },
      {
        eyebrow: "Choosing & Caring",
        pageTitle: "Questions to Bring to the Appointment",
        intro: "Most people decide better with a few questions ready. Tick the ones that matter most to you and we'll work through them.",
        sections: [
          { kind: "list", title: "Worth Asking Us", items: [
            { title: "Which options actually suit my mouth?", tag: "FIRST VISIT", body: "Bone level, the health of teeth either side, and your bite all narrow the choice." },
            { title: "How long will each option last?", tag: "REALISTIC NUMBERS", body: "Average lifespan and what tends to go wrong first." },
            { title: "How much, and over what timeline?", tag: "QUOTE IN WRITING", body: "Itemised so you can compare. Implants are paid in stages over months, not all upfront." },
            { title: "What does it look and feel like?", tag: "EXAMPLES", body: "We can show you photos of similar cases and let you handle a denture or bridge example." },
            { title: "What if I do nothing for now?", tag: "ALWAYS VALID", body: "Always worth asking. Sometimes the right answer is \"wait and see\"." },
          ]},
          { kind: "compare", title: "Looking After the Result",
            left:  { title: "All replacements need", items: [
              "Brushing twice a day with fluoride toothpaste.",
              "Cleaning between teeth daily — and special care under bridges (superfloss or interdental brush).",
              "Hygienist visits every 6 months — gum disease is the main reason replacements fail.",
              "A nightguard if you grind.",
            ]},
            right: { title: "Shortens their life", items: [
              "Smoking — particularly bad for implants.",
              "Skipping interdental cleaning around bridges.",
              "Sleeping in partial dentures.",
              "Using teeth as tools or chewing ice.",
            ]},
          },
        ],
        noticeBox: { title: "Ring the practice if you notice:", items: [
          "A bridge or implant crown that feels loose or wobbly.",
          "Bleeding gums around an implant or bridge — the equivalent of gum disease and worth seeing early.",
          "Pain on biting, or food packing into a particular gap.",
          "A denture that has cracked, lost a tooth or no longer fits as it used to.",
        ]},
      },
    ],
  },

  /* ─── 16 · Wisdom Teeth ───────────────────────────────────────────────── */
  {
    id: "wisdom-teeth",
    num: "16",
    ref: "PI-WIS-01",
    category: "surgery",
    title: "Wisdom Teeth",
    summary: "What can go wrong, when they need out, and the nerve question.",
    intro: "Wisdom teeth are the last molars at the back of each side. They usually arrive between seventeen and twenty-five. Some come through cleanly and never cause any bother. Others don't fit, and that's where the problems start.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          { kind: "numbered", title: "What Can Go Wrong", items: [
            { title: "Impaction.", body: "The tooth doesn't have room to come through and is angled forwards or sideways. Often it sits half under the gum." },
            { title: "Pericoronitis.", body: "The flap of gum over a partly erupted wisdom tooth traps food and bacteria. The result is a sore, swollen, sometimes pussy gum at the very back, often with a bad taste and a sore throat on the same side." },
            { title: "Decay or gum disease.", body: "Wisdom teeth are hard to reach with a toothbrush. They — and the tooth in front of them — develop decay and gum problems more readily than the rest of the mouth." },
            { title: "Cysts.", body: "Less common, but wisdom teeth that stay buried for years can occasionally form a cyst around the crown. We pick these up on routine X-rays." },
          ]},
          { kind: "prose", title: "When They Need to Come Out", items: [
            { lead: "Repeated infections.", body: "Two or more episodes of pericoronitis is the usual threshold." },
            { lead: "Decay we can't reliably fix.", body: "In the wisdom tooth itself, or in the tooth in front of it because the wisdom tooth is leaning on it." },
            { lead: "Gum disease around them.", body: "That isn't responding to cleaning." },
            { lead: "Cysts or other pathology.", body: "Always." },
          ]},
          { kind: "prose", title: "When We Leave Them Alone", items: [
            { lead: "", body: "Wisdom teeth that are fully through, in line with the others, easy to clean and causing no trouble are best left alone. Routine removal of trouble-free wisdom teeth is no longer recommended in the UK — the NICE guidelines back this up." },
          ]},
          { kind: "prose", title: "What the Procedure Involves", items: [
            { lead: "", body: "Most wisdom teeth come out under local anaesthetic at the practice. More awkward ones — particularly the lower ones, or those very close to the nerve — are sometimes referred for sedation or to a hospital specialist. We always discuss this at the consultation." },
          ]},
        ],
        callout: { title: "The nerve question", body: "Lower wisdom teeth sit close to the nerve that supplies feeling to the lip and chin. In a small number of cases, removing them can leave that area numb or tingly for weeks, and very rarely longer. We use a 3D scan (CBCT) where the X-ray suggests the nerve is close, and we'll talk through the specific risks for your case before any procedure." },
        notice: { title: "For a flare-up right now", body: "Warm salt-water rinses every few hours, careful brushing of the area, and paracetamol or ibuprofen as you would for any pain. If the cheek or jaw is swelling, you can't open your mouth properly, or you have a temperature, ring the practice the same day." },
      },
      {
        eyebrow: "Aftercare",
        pageTitle: "After a Wisdom Tooth Removal",
        intro: "Most people are sore for two to three days, swollen for three to five, and back to feeling normal within a week or two. Following the first 48 hours carefully is what makes the difference.",
        sections: [
          { kind: "list", title: "The First 24 Hours", items: [
            { title: "Bite gently on the gauze.", tag: "30 MINS", body: "Some oozing is normal for the rest of the day. Replace the gauze if it soaks through." },
            { title: "Ice pack on the cheek.", tag: "FIRST 4 HOURS", body: "Twenty minutes on, twenty off. Reduces swelling." },
            { title: "No rinsing, spitting or sucking through a straw.", tag: "24 HOURS", body: "All three pull the clot out and lead to dry socket — by far the most common complication." },
            { title: "No smoking.", tag: "AT LEAST 72 HOURS", body: "Dramatically increases the risk of dry socket. Longer is better." },
            { title: "Soft, cool food and plenty of water.", tag: "DAY 1", body: "Yoghurt, soup at lukewarm, smoothies, scrambled egg." },
          ]},
          { kind: "list", title: "Days 2–7", items: [
            { title: "Warm salt-water rinses.", tag: "3× A DAY", body: "A teaspoon of salt in a mug of warm water, after meals. Don't swill — let it sit and tip out." },
            { title: "Brush as normal — gently around the area.", tag: "FROM DAY 2", body: "The area heals faster when it's clean." },
            { title: "Paracetamol and ibuprofen together work well.", tag: "FIRST FEW DAYS", body: "Take regularly for the first 48 hours rather than waiting for pain to build, unless you've been told otherwise." },
            { title: "Soft foods until comfortable.", tag: "AROUND 1 WEEK", body: "Avoid crusty bread, popcorn and crisps that can lodge in the socket." },
          ]},
        ],
        noticeBox: { title: "Ring the practice if you notice:", items: [
          "Severe pain that gets worse from day 3 to 5 (classic sign of dry socket).",
          "Bleeding that doesn't stop after 30 minutes of firm pressure.",
          "Increasing swelling, a temperature, or difficulty swallowing or breathing.",
          "Numbness in the lip, chin or tongue lasting more than a couple of days.",
        ]},
      },
    ],
  },

  /* ─── 17 · After a Tooth Extraction ───────────────────────────────────── */
  {
    id: "after-extraction",
    num: "17",
    ref: "PI-EXT-01",
    category: "surgery",
    title: "After a Tooth Extraction",
    summary: "Healing timeline, dry socket, and the first few days.",
    intro: "Most extractions heal cleanly within a week to ten days. The first 24 hours decide a lot of that — what you do (and don't do) protects the blood clot that fills the socket and is the start of healing.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          { kind: "numbered", title: "What Healing Looks Like", items: [
            { title: "The clot forms.", body: "A blood clot fills the socket within the first hour. This is the foundation of healing — losing it leads to dry socket." },
            { title: "The gum closes over.", body: "Days 3–7. The clot is gradually replaced by soft tissue and the gum knits across the top." },
            { title: "The bone fills in.", body: "Over the next few months, new bone forms underneath. The dent in the gum smooths out." },
          ]},
          { kind: "prose", title: "What to Expect", items: [
            { lead: "Some oozing for the rest of the day.", body: "Saliva tinged pink is normal. Heavy fresh-red bleeding is not." },
            { lead: "Swelling that peaks at 48–72 hours.", body: "Then settles. An ice pack in the first few hours keeps it down." },
            { lead: "Stiffness opening the mouth.", body: "Especially after lower back teeth. Improves over a few days." },
            { lead: "A taste in the mouth.", body: "Iron-y at first from the blood, sometimes a bit unpleasant later as food bits collect in the socket. Salt-water rinses sort this out." },
          ]},
        ],
        callout: { title: "Dry socket", body: "Dry socket is the most common complication — the clot is lost, leaving exposed bone. It shows up as a sharp, throbbing pain getting worse from day 3 to 5, often with a bad taste. It is much more common in smokers and after lower wisdom teeth. It's easily treated — ring us, don't put up with it." },
        notice: { title: "Painkillers", body: "Paracetamol and ibuprofen taken together work well for most people, unless you've been told otherwise. Take them regularly for the first 48 hours rather than waiting for the pain to build. Avoid aspirin — it thins the blood and can encourage bleeding." },
      },
      {
        eyebrow: "Aftercare",
        pageTitle: "The First Few Days",
        intro: "Stick closely to the first 24 hours, then you can mostly get back to normal — with a couple of exceptions through the first week.",
        sections: [
          { kind: "list", title: "The First 24 Hours", items: [
            { title: "Bite gently on the gauze.", tag: "30 MINS", body: "Firm pressure, jaw closed. Replace if it soaks through." },
            { title: "Ice pack on the cheek.", tag: "FIRST 4 HOURS", body: "Twenty minutes on, twenty off." },
            { title: "No rinsing, spitting or sucking through a straw.", tag: "24 HOURS", body: "All three pull the clot out. The single most important rule." },
            { title: "No smoking or vaping.", tag: "AT LEAST 72 HOURS", body: "Hugely raises the risk of dry socket." },
            { title: "No alcohol or strenuous exercise.", tag: "24 HOURS", body: "Both raise blood pressure and restart bleeding." },
            { title: "Eat soft, cool food.", tag: "DAY 1", body: "Yoghurt, scrambled egg, lukewarm soup, smoothies (eaten with a spoon, not a straw)." },
            { title: "Sleep with an extra pillow.", tag: "FIRST 2 NIGHTS", body: "Slightly upright reduces swelling and oozing." },
          ]},
          { kind: "list", title: "Days 2–7", items: [
            { title: "Warm salt-water rinses.", tag: "3× A DAY", body: "Teaspoon of salt in a mug of warm water, after meals. Gentle — let it sit and tip out." },
            { title: "Brush as normal — gently around the area.", tag: "FROM DAY 2", body: "The socket heals faster when the rest of the mouth is clean." },
            { title: "Soft foods until comfortable.", tag: "~1 WEEK", body: "Avoid crisps, popcorn and crusty bread that lodge in the socket." },
          ]},
        ],
        noticeBox: { title: "Ring the practice if you notice:", items: [
          "Bleeding that doesn't stop after 30 minutes of firm pressure on a fresh piece of gauze.",
          "Severe pain getting worse from day 3 to 5 (sign of dry socket).",
          "Increasing swelling, fever, or difficulty swallowing or breathing.",
          "Numbness in the lip, chin or tongue lasting more than a couple of days.",
          "Pus from the socket.",
        ]},
      },
    ],
  },

  /* ─── 18 · Sinus Lift & Bone Graft ────────────────────────────────────── */
  {
    id: "sinus-lift-graft",
    num: "18",
    ref: "PI-SLB-01",
    category: "surgery",
    title: "Sinus Lift & Bone Graft",
    summary: "Adding the bone an implant needs to anchor into.",
    intro: "A dental implant needs enough bone to anchor into. When a tooth has been missing for a long time, or a back upper tooth has been lost beneath the sinus, there often isn't quite enough bone in the right place. A graft adds what's missing so the implant has something solid to hold on to.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          { kind: "numbered", title: "Why Bone Disappears", items: [
            { title: "Use it or lose it.", body: "Bone around a tooth is maintained by chewing forces. Once the tooth is gone, the body shrinks the bone away — fastest in the first year, then more slowly." },
            { title: "The upper back jaw is thinnest.", body: "Above the upper molars and premolars sits the maxillary sinus — an air-filled space. When the teeth come out, the sinus floor often drops down into the gap, leaving very little bone for an implant." },
            { title: "Gum disease accelerates it.", body: "Long-standing gum disease eats bone around the teeth before they're even lost. Many patients arrive needing implants in exactly the sites with the least bone left." },
          ]},
          { kind: "prose", title: "The Two Procedures", items: [
            { lead: "Bone graft (socket preservation or ridge augmentation).", body: "Granules of bone (from a sterile bovine source, or synthetic) are placed into a recent extraction site, or onto a thin ridge, and covered with a collagen membrane. The body remodels it into your own bone over 4–6 months." },
            { lead: "Sinus lift (sinus augmentation).", body: "Through a small window in the bone above the back upper teeth, the sinus lining is lifted gently upwards and bone graft material packed into the space underneath. Heals over 6–9 months, leaving a thicker floor of bone for the implant." },
            { lead: "Sometimes done together with the implant.", body: "If there is at least 4–5 mm of bone to start with, the graft and the implant can go in at the same visit. Less bone than that, and the graft heals first and the implant follows later." },
          ]},
        ],
        callout: { title: "Is it painful?", body: "Most patients are surprised by how comfortable it is. The procedure is done under local anaesthetic, with sedation if you'd like. There is some swelling and bruising for a few days, controlled with ibuprofen and paracetamol. Most people are back at a desk job within 24–48 hours." },
        notice: { title: "The wait is the hardest part", body: "The graft itself is straightforward — the patience of waiting 4–9 months for it to mature is what most patients find frustrating. We'd rather wait than place an implant into bone that isn't ready; failure rates climb quickly when the bone isn't right." },
      },
      {
        eyebrow: "After Your Graft",
        pageTitle: "Looking After the Site",
        intro: "The graft is delicate for the first two weeks while the membrane stays in place. The points below matter more after a graft than after a routine extraction.",
        sections: [
          { kind: "list", title: "First Two Weeks", items: [
            { title: "Don't blow your nose.", tag: "AFTER A SINUS LIFT", body: "For 2 weeks. Sneeze with your mouth open. Pressure can shift the graft before it's set." },
            { title: "No straws, no smoking.", tag: "2 WEEKS MINIMUM", body: "Suction pulls the clot and the graft out. Smoking also dramatically lowers the chance of the graft taking." },
            { title: "Soft foods, chew on the other side.", tag: "FIRST 10–14 DAYS", body: "Eggs, fish, pasta, soup. Nothing crunchy or chewy biting directly onto the site." },
            { title: "Take the antibiotics we prescribe.", tag: "AS DIRECTED", body: "Finish the course even if you feel fine. We may also give a chlorhexidine mouthwash from day 2." },
            { title: "Brush gently around it.", tag: "FROM DAY 2", body: "Soft brush, avoid the actual graft site for the first week. Keeping the rest of the mouth clean helps the area heal." },
          ]},
          { kind: "compare", title: "Helps & Hinders",
            left:  { title: "Helps", items: [
              "Sleeping with your head slightly raised for the first 2–3 nights.",
              "Cold packs over the cheek for the first 24 hours.",
              "Plenty of water, well-balanced food.",
              "Coming back for the planned reviews — even if everything feels fine.",
            ]},
            right: { title: "Hinders", items: [
              "Smoking, vaping, and shisha. The biggest single cause of graft failure.",
              "Flying within 1 week of a sinus lift (pressure changes).",
              "Heavy lifting or vigorous exercise in the first week.",
              "Poking the area with your tongue or finger.",
            ]},
          },
        ],
        noticeBox: { title: "Ring the practice if you notice:", items: [
          "A salty or metallic taste, or fluid coming through your nose.",
          "Sudden bleeding from the nose on the side of the surgery.",
          "Increasing pain or swelling after day 3 (it should be improving by then).",
          "Granules visible in the mouth — small numbers are normal, lots aren't.",
          "The membrane becoming exposed or the stitches coming loose early.",
        ]},
      },
    ],
  },

  /* ─── 19 · Frenectomy & Tongue-Tie ────────────────────────────────────── */
  {
    id: "frenectomy",
    num: "19",
    ref: "PI-FRN-01",
    category: "surgery",
    title: "Frenectomy & Tongue-Tie",
    summary: "When a frenum is worth releasing — and when it isn't.",
    intro: "A frenum is a small fold of tissue connecting the lip or the tongue to the gum or the floor of the mouth. Most are unremarkable. A few are tight or attached high enough to cause feeding, speech or dental problems — and a small procedure called a frenectomy releases them.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          { kind: "numbered", title: "The Two We See Most Often", items: [
            { title: "Tongue-tie (lingual frenum).", body: "The fold under the tongue is short or attached too close to the tip. The tongue can't lift, stick out properly or move side-to-side. In babies it can affect breastfeeding; later, it can affect speech sounds (t, d, l, s) and eating." },
            { title: "Lip-tie (labial frenum).", body: "Most often the upper lip. A thick or low-attached frenum can hold the lip down, make a gap between the upper front teeth, or trap milk and food against the gum." },
            { title: "When it usually doesn't need anything.", body: "A frenum that looks visible but doesn't restrict movement, doesn't cause feeding or speech problems, and isn't pulling on the gum, can simply be left alone." },
          ]},
          { kind: "prose", title: "Signs It Might Be Worth Releasing", items: [
            { lead: "In babies.", body: "Painful breastfeeding, poor latch, clicking sounds, falling off the breast, slow weight gain. Always seen in conjunction with a midwife, lactation consultant or GP." },
            { lead: "In children.", body: "Difficulty saying certain sounds after age 4, can't lick an ice cream off their lips, can't reach the upper teeth with the tongue, persistent gap between upper front teeth." },
            { lead: "In adults.", body: "Gum recession on a single front tooth where the frenum pulls, denture instability, persistent speech issues, post-orthodontic gap that won't close." },
            { lead: "When orthodontics is involved.", body: "Sometimes the orthodontist asks for a frenectomy after a gap has been closed, so it stays closed." },
          ]},
        ],
        callout: { title: "The procedure", body: "For older children and adults: a few minutes under local anaesthetic. The frenum is released with a scalpel, scissors or dental laser, and one or two small dissolvable stitches placed if needed. Healing takes about a week. For babies, a different team and technique is used and we'll refer you. We don't carry out infant tongue-tie division at the practice." },
        notice: { title: "Tongue-tie is often over-diagnosed", body: "Not every breastfeeding problem is a tongue-tie, and not every tight-looking frenum needs releasing. The decision is made on whether the tongue can function, not just on how it looks. We'll work with your midwife, lactation consultant or speech therapist before recommending anything." },
      },
      {
        eyebrow: "After the Procedure",
        pageTitle: "Healing & Stretches",
        intro: "The site closes quickly — usually within a week. The point of the stretches below is to stop the released tissue knitting straight back together. They feel odd at first; they aren't painful.",
        sections: [
          { kind: "list", title: "First Week", items: [
            { title: "Pain relief.", tag: "FIRST 24–48 HOURS", body: "Paracetamol or ibuprofen at the usual dose works well. Most older children and adults barely need anything by day 2." },
            { title: "Soft, cool foods.", tag: "FIRST 2–3 DAYS", body: "Yoghurt, smooth soup, mashed potato, pasta. Avoid hot, spicy or crunchy foods that catch the area." },
            { title: "Salt-water rinses.", tag: "FROM DAY 2, 3× A DAY", body: "Half-teaspoon of salt in a mug of warm water. Keeps the site clean while it heals." },
            { title: "Brush gently around it.", tag: "FROM DAY 1", body: "Avoid the actual wound for the first 2–3 days, then bring the soft brush back in carefully." },
          ]},
          { kind: "list", title: "Stretches (for tongue-tie releases)", items: [
            { title: "Lift the tongue.", tag: "3× A DAY, 1–2 WEEKS", body: "Clean finger or cotton bud, gently lift the tongue towards the roof of the mouth and hold for a couple of seconds. Stops the wound re-attaching." },
            { title: "Side-to-side and out.", tag: "3× A DAY", body: "Stick the tongue out, side to side, and try to touch the upper lip. Build the new range of motion." },
            { title: "For lip-tie.", tag: "3× A DAY", body: "Gently lift the upper lip up and out, hold briefly. Run a clean finger along the wound to keep the edges from sticking back together." },
            { title: "Speech-therapist exercises.", tag: "AS ADVISED", body: "If the release was for speech reasons, exercises from a speech therapist make a real difference once healed." },
          ]},
        ],
        noticeBox: { title: "Ring the practice if you notice:", items: [
          "Bleeding that hasn't stopped after 30 minutes of firm pressure.",
          "Increasing pain or swelling after day 3.",
          "Signs of infection — pus, fever, bad taste.",
          "The released area looks like it's knitted straight back together.",
          "The tongue or lip still doesn't move as expected after 2–3 weeks of stretches.",
        ]},
      },
    ],
  },

  /* ─── 20 · Root Canal Treatment ───────────────────────────────────────── */
  {
    id: "root-canal",
    num: "20",
    ref: "PI-END-04",
    category: "surgery",
    title: "Root Canal Treatment — What to Expect",
    summary: "The procedure, recovery, and why the crown afterwards matters.",
    intro: "Root canal treatment has a worse reputation than it deserves. With modern anaesthetic and instruments, most patients describe it as similar to having a large filling. The point of the treatment is to relieve the pain you came in with and to keep your own tooth rather than lose it.",
    pages: [
      {
        eyebrow: "Patient Information Sheet",
        sections: [
          { kind: "prose", title: "What Is Root Canal Treatment?", items: [
            { lead: "", body: "Inside your tooth, beneath the white enamel and a hard layer called dentin, is a soft tissue called the pulp. This contains blood vessels, nerves, and connective tissue. When the pulp becomes inflamed or infected — due to deep decay or injury — it must be removed to save the tooth." },
          ]},
          { kind: "numbered", title: "The Procedure: Step by Step", items: [
            { title: "Local Anaesthetic.", body: "We ensure the area is completely numb. You should feel no more discomfort than you would during a routine filling." },
            { title: "Access & Cleaning.", body: "A small opening is made in the crown of the tooth. Using specialized tools, the dentist removes the damaged pulp and cleans the root canals." },
            { title: "Shaping & Filling.", body: "The canals are shaped and then filled with a biocompatible material (usually gutta-percha) to seal the space." },
            { title: "Temporary Restoration.", body: "A temporary filling is usually placed to close the opening until your next visit." },
          ]},
          { kind: "prose", title: "What to Expect After Your Visit", items: [
            { lead: "Sensitivity.", body: "For the first few days, the tooth may feel sensitive to pressure or touch, especially if there was pain or infection before the procedure." },
            { lead: "Medication.", body: "This sensitivity can usually be managed with standard over-the-counter pain relief." },
            { lead: "Protection.", body: "Until your tooth is fully restored with a permanent crown, try to avoid biting or chewing on it to prevent the tooth from cracking." },
          ]},
        ],
        callout: { title: "About the permanent crown", body: "A tooth becomes more brittle once the nerve has been removed, so back teeth in particular almost always need a crown afterwards. The crown protects against future fractures and lets you chew normally again." },
        notice: { title: "Note to patient", body: "If you experience severe swelling or pain that lasts more than a few days, please contact the Practice immediately." },
      },
      {
        eyebrow: "Aftercare",
        pageTitle: "Your Recovery Checklist",
        intro: "Tick each item off as you go. Most patients feel back to normal within a few days. Keep this page somewhere you'll see it — on the fridge or by the bathroom mirror works well.",
        sections: [
          { kind: "list", title: "The First 24 Hours", items: [
            { title: "Wait for numbness to wear off before eating.", tag: "2–4 HRS", body: "Biting your cheek or tongue while numb is the most common post-treatment injury." },
            { title: "Take pain relief at the first sign of discomfort.", tag: "AS NEEDED", body: "Standard over-the-counter ibuprofen or paracetamol, taken at the recommended dose." },
            { title: "Stick to soft, lukewarm foods.", tag: "DAY 1", body: "Soup, yoghurt, scrambled egg, mashed potato. Avoid anything very hot or very cold." },
            { title: "Chew on the opposite side of your mouth.", tag: "UNTIL CROWN" },
          ]},
          { kind: "compare", title: "Day-to-Day: Do & Avoid",
            left:  { title: "Do", items: [
              "Brush gently twice a day, including the treated tooth.",
              "Floss carefully — go slowly around the temporary filling.",
              "Rinse with warm salt water if the area feels tender.",
              "Keep your follow-up appointment for the permanent crown.",
            ]},
            right: { title: "Avoid", items: [
              "Hard foods — nuts, ice, crusty bread, hard sweets.",
              "Sticky foods that can pull the temporary filling out.",
              "Smoking — it slows healing of the surrounding tissue.",
              "Delaying the crown — the tooth is more likely to crack without it.",
            ]},
          },
        ],
        noticeBox: { title: "Call the practice if you notice:", items: [
          "Severe swelling in the gum, cheek, or jaw.",
          "Pain that worsens, or doesn't improve after 3 days.",
          "The temporary filling falls out or feels loose.",
          "An uneven bite, or the tooth feels \"high\" when you close.",
          "Fever, or a bad taste that doesn't go away.",
        ]},
      },
    ],
  },

  /* ─── 22 · Hygienist Visits ───────────────────────────────────────────── */
  {
    id: "hygienist-visits",
    num: "22",
    ref: "PI-HYG-01",
    category: "gum",
    title: "Hygienist Visits",
    summary: "What a clean actually involves, and why it matters even if you brush well.",
    intro: "The hygienist looks after the gums and the cleaning side of things — the half of dentistry that prevents problems rather than fixes them. For most people, an appointment every six months is enough; for some, every three or four.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          { kind: "numbered", title: "What a Visit Involves", items: [
            { title: "Checking your gums.", body: "A small probe measures the spaces between the gum and tooth. Healthy gums are 1–3 mm; deeper pockets tell us where gum disease is starting." },
            { title: "Removing the build-up.", body: "Tartar (hardened plaque) can't be brushed off. We use a fine ultrasonic scaler with water — vibration, not scraping. It gets the plaque and tartar off above and just below the gum line." },
            { title: "Air-polish or stain removal.", body: "A jet of fine powder and water lifts tea, coffee and tobacco stains. Optional, and gentler than the old polishing paste." },
            { title: "Coaching on home care.", body: "The bit that decides everything. We show you exactly where you're missing, and what brush or interdental size fits you. Five minutes here pays back for years." },
            { title: "Fluoride varnish.", body: "A quick painted-on layer on at-risk surfaces, especially around the gum line where roots are exposed." },
          ]},
          { kind: "prose", title: "Why It Matters Even If You Brush Well", items: [
            { lead: "", body: "Plaque turns into tartar within 24–72 hours of being missed. Once it's tartar, no amount of brushing or flossing will shift it — the surface is too rough and bonded to the tooth. Tartar then collects more plaque around it, which is what starts gum disease. The hygienist resets that surface back to clean so your home cleaning can actually do its job." },
          ]},
        ],
        callout: { title: "Does it hurt?", body: "Honestly, less than most people expect. The ultrasonic scaler vibrates rather than scrapes; the worst most people feel is a cool water spray and a brief tickle on sensitive areas. We can use a numbing gel if you're tender, and for deeper cleaning we'll use proper local anaesthetic. If you've been putting it off because of an old bad memory, please tell us — modern hygiene is a different experience." },
        notice: { title: "Bleeding afterwards is a good sign", body: "If your gums bleed for a day or two after a clean, it's the inflammation calming down — not the cleaning being too rough. Keep brushing and flossing as we've shown. Bleeding usually stops within a week or two as the gums tighten back up." },
      },
      {
        eyebrow: "After Your Visit",
        pageTitle: "After a Hygienist Appointment",
        intro: "The clean we've done lasts as long as your home routine keeps it that way. Here's what to expect for a few days, and the routine that holds the result.",
        sections: [
          { kind: "list", title: "The Next Few Days", items: [
            { title: "Sensitivity to cold.", tag: "A FEW DAYS", body: "Common, especially if there was a lot of tartar covering the gum line. Use a sensitive toothpaste, smeared on at bedtime — don't rinse." },
            { title: "Slight bleeding when brushing.", tag: "1–2 WEEKS", body: "The gums are settling. Keep brushing and cleaning between the teeth — bleeding is the sign you need to keep going, not stop." },
            { title: "Teeth feeling \"bigger\" or looser.", tag: "FIRST FEW DAYS", body: "Tartar can hide gum recession. Now you're feeling the actual shape of the tooth. The gums tighten back over the next few weeks." },
          ]},
          { kind: "compare", title: "Holding the Result at Home",
            left:  { title: "Daily routine", items: [
              "Brush twice a day, two minutes, with fluoride toothpaste.",
              "Clean between the teeth daily — interdental brushes preferred to floss for most adults.",
              "Spit, don't rinse, after brushing.",
              "Come back at the interval we've recommended — usually 6 months.",
            ]},
            right: { title: "Easily missed", items: [
              "The inside surfaces of the lower front teeth — biggest tartar trap.",
              "The back of the last molar.",
              "The gum line itself — angle the brush 45° towards the gum.",
              "Cleaning between teeth — most adults skip this entirely. It is half the job.",
            ]},
          },
        ],
        noticeBox: { title: "Ring the practice if you notice:", items: [
          "Pain or marked sensitivity that hasn't settled within two weeks.",
          "Bleeding gums that are getting worse rather than better.",
          "A tooth that feels loose or has shifted position.",
          "An ulcer or sore spot that isn't healing — see our ulcers leaflet.",
        ]},
      },
    ],
  },

  /* ─── 23 · Bad Breath (Halitosis) ─────────────────────────────────────── */
  {
    id: "bad-breath",
    num: "23",
    ref: "PI-HAL-02",
    category: "gum",
    title: "Bad Breath (Halitosis)",
    summary: "Where it comes from, and the daily routine that actually shifts it.",
    intro: "Bad breath is almost always caused by something in the mouth itself, not the stomach. The good news in that — it's fixable, once you know which of the usual suspects is behind it.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          { kind: "numbered", title: "Where It Comes From", items: [
            { title: "The tongue (most cases).", body: "The back of the tongue is grooved and traps food, dead cells and bacteria. Those bacteria release sulphur gases — the main smell of morning breath." },
            { title: "Gum disease and trapped food.", body: "Plaque under the gum line and food caught between teeth. Often shows up as a metallic taste alongside the smell." },
            { title: "A dry mouth.", body: "Saliva washes the mouth clean. Dehydration, mouth-breathing, snoring and many medications all reduce it." },
            { title: "Sinuses and tonsils.", body: "Post-nasal drip and tonsil stones (small white lumps in the tonsils) account for most \"stomach breath\" that turns out not to be the stomach." },
          ]},
          { kind: "prose", title: "What Doesn't Help", items: [
            { lead: "Mints and chewing gum (with sugar).", body: "Mask the smell briefly, feed the bacteria for hours afterwards." },
            { lead: "Alcohol-based mouthwashes.", body: "Dry the mouth out, which makes the underlying problem worse within an hour or two." },
            { lead: "Brushing harder, more often.", body: "If you're missing the back of the tongue and between the teeth, frequency won't fix it." },
          ]},
        ],
        callout: { title: "The tongue test", body: "Run a clean teaspoon along the back of the tongue. Look at the white-yellow coating on it, leave it for a minute, then smell. That coating is what most people are smelling. Cleaning it off — properly, daily — is the single biggest change for most people with persistent bad breath." },
        notice: { title: "When it isn't the mouth", body: "A small number of cases come from elsewhere — sinus infections, tonsil stones, reflux, uncontrolled diabetes (a sweet, fruity smell), liver or kidney problems. If the mouth is healthy and the routine below isn't working, see your GP." },
      },
      {
        eyebrow: "Everyday Habits",
        pageTitle: "A Daily Routine That Actually Works",
        intro: "Most persistent bad breath improves within two weeks if all of these are done consistently. Half measures don't shift it.",
        sections: [
          { kind: "list", title: "Twice a Day", items: [
            { title: "Brush teeth, two minutes.", tag: "MORNING & NIGHT", body: "Fluoride toothpaste, electric brush ideally. Spit, don't rinse." },
            { title: "Clean between the teeth.", tag: "ONCE A DAY", body: "Interdental brushes are easier and more effective than floss for most adults. Trapped food is a major contributor." },
            { title: "Clean the tongue.", tag: "ONCE A DAY", body: "A plastic tongue scraper from any pharmacy. Stick the tongue out, scrape from back to front 5–6 times, rinse the scraper between strokes. Two minutes total." },
          ]},
          { kind: "list", title: "Through the Day", items: [
            { title: "Drink water steadily.", tag: "DAILY", body: "A dry mouth in the afternoon is a common culprit. Sip water rather than wait until you're thirsty." },
            { title: "Sugar-free gum after meals.", tag: "15–20 MINS", body: "Stimulates saliva, the mouth's built-in cleaner. Look for xylitol on the ingredient list." },
            { title: "Rinse after coffee, alcohol, garlic and onion.", tag: "AS NEEDED", body: "A glass of water doesn't remove the smell, but stops it sticking around as long." },
          ]},
          { kind: "compare", title: "Helps & Less Helpful",
            left:  { title: "Helps", items: [
              "Hygienist visit twice a year, or more often if recommended.",
              "Alcohol-free mouthwash with chlorhexidine or zinc, used short-term if advised.",
              "Telling us — most people don't mention it. We won't be embarrassed and neither should you be.",
            ]},
            right: { title: "Doesn't help", items: [
              "Mints and sugary chewing gum.",
              "Strong mouthwashes used long-term — disturb the natural balance.",
              "Smoking and vaping — both dry the mouth and add their own smell.",
              "Skipping breakfast — long gaps without eating dry the mouth out.",
            ]},
          },
        ],
        noticeBox: { title: "Talk to us if you notice:", items: [
          "Bad breath that hasn't improved after two weeks of the routine above.",
          "A persistent metallic or \"off\" taste in the mouth.",
          "Bleeding gums or a tooth that has started to feel loose.",
          "A constant white-yellow coating on the tongue that scrapes off but comes straight back.",
        ]},
      },
    ],
  },

  /* ─── 24 · Mouth Ulcers ───────────────────────────────────────────────── */
  {
    id: "mouth-ulcers",
    num: "24",
    ref: "PI-ULC-01",
    category: "gum",
    title: "Mouth Ulcers",
    summary: "Common, harmless, and the two-week rule for the ones that aren't.",
    intro: "Most mouth ulcers are harmless and clear up on their own within a couple of weeks. A small number don't — and those are the ones we want to see. The two-week rule below is the simplest thing to remember.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          { kind: "numbered", title: "The Common Kinds", items: [
            { title: "Aphthous ulcers (the everyday kind).", body: "Small, round, white or yellow centre with a red rim. On the inside of the cheek, lip or under the tongue. Sting when you eat citrus or salty food. Heal in 7–14 days, no scar." },
            { title: "Trauma ulcers.", body: "Where you've bitten the inside of your cheek, caught a sharp tooth or a denture has rubbed. Heal as soon as the cause is sorted out." },
            { title: "Ulcers from a virus.", body: "Cold sores on the lip (herpes simplex). In children, sometimes a first cold-sore infection causes lots of small ulcers all at once with a fever." },
          ]},
          { kind: "prose", title: "What Brings Them On", items: [
            { lead: "Stress and being run-down.", body: "The single most common trigger. Ulcers often turn up around exams, deadlines and after a bad night's sleep." },
            { lead: "A nip or a knock.", body: "Biting your cheek, a sharp filling, a new denture, a wayward toothbrush." },
            { lead: "Toothpaste with SLS.", body: "Sodium lauryl sulphate (the foaming agent) sets some people off. Try an SLS-free toothpaste — Sensodyne ProNamel and Oranurse are widely available." },
            { lead: "Certain foods.", body: "Tomatoes, citrus, chocolate, coffee, cinnamon and strong cheese all show up as triggers in some people." },
            { lead: "Low iron, B12 or folate.", body: "Worth a blood test from your GP if you are getting ulcer after ulcer." },
            { lead: "Hormonal changes.", body: "Some people get ulcers in the run-up to a period." },
          ]},
        ],
        callout: { title: "The two-week rule", body: "Any ulcer, lump, red patch or white patch in the mouth that has not healed after two weeks should be looked at — even if it isn't hurting. Not because it's likely to be anything sinister, but because the few that do matter look just like the harmless ones early on. Ring us, don't wait for your next check-up." },
        notice: { title: "What helps the pain", body: "Salt-water rinses (a teaspoon of salt in a mug of warm water) used 3–4 times a day. Bonjela or Iglu numbing gels for short relief while eating. Difflam (benzydamine) mouthwash from a pharmacy if it really stings. Stick to soft, lukewarm food and steer clear of citrus, salt-and-vinegar crisps and crusty bread until it heals." },
      },
      {
        eyebrow: "Self-Care",
        pageTitle: "Settling an Ulcer",
        intro: "Ordinary ulcers heal in their own time — usually a week to a fortnight. The aim is to keep them comfortable while they do, and to spot the patterns that tell us something else is going on.",
        sections: [
          { kind: "list", title: "Day-to-Day", items: [
            { title: "Salt-water rinses.", tag: "3–4× A DAY", body: "Teaspoon of salt in a mug of warm water. The cheapest, simplest thing that helps." },
            { title: "Numbing gel before meals.", tag: "AS NEEDED", body: "Bonjela / Iglu, dabbed on. Gives you 20 minutes of relief." },
            { title: "Try an SLS-free toothpaste.", tag: "IF RECURRENT", body: "Switch for a month. If you stop getting ulcers, you've found the trigger." },
            { title: "Keep the rest of the mouth clean.", tag: "DAILY", body: "Brushing gently around the ulcer helps it heal faster, not slower." },
          ]},
          { kind: "compare", title: "Friendly & Less Friendly",
            left:  { title: "Helps healing", items: [
              "Soft, lukewarm food (porridge, mash, scrambled egg).",
              "Drinking through a straw to bypass the sore spot.",
              "Sleep, water, and easing off the things you know stress you.",
              "Asking the GP for a blood test if you keep getting them.",
            ]},
            right: { title: "Slows healing", items: [
              "Citrus, tomatoes, vinegar and salty crisps.",
              "Crusty bread, toast and anything sharp-edged.",
              "Alcohol-based mouthwashes — sting and don't help.",
              "Smoking and vaping.",
            ]},
          },
        ],
        noticeBox: { title: "Ring the practice if:", items: [
          "An ulcer hasn't healed after two weeks.",
          "An ulcer is unusually large (over 1 cm), or much more painful than usual.",
          "You keep getting ulcer after ulcer (more than three or four a year).",
          "You can feel a lump under the ulcer, or the area looks white or red rather than the usual pale yellow.",
          "You have ulcers along with skin rashes, eye soreness or tummy symptoms — your GP may want to look into it too.",
        ]},
      },
    ],
  },

  /* ─── 25 · Cold Sores ─────────────────────────────────────────────────── */
  {
    id: "cold-sores",
    num: "25",
    ref: "PI-CLS-01",
    category: "gum",
    title: "Cold Sores",
    summary: "Catch them at the tingle — and stop the next one with SPF.",
    intro: "Cold sores are caused by the herpes simplex virus, which most of us pick up in childhood and carry quietly for life. The virus reactivates from time to time — usually when we're run-down, stressed or have had too much sun — and turns up as the familiar tingle, blister and crust on the lip.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          { kind: "numbered", title: "The Pattern of an Outbreak", items: [
            { title: "Tingle (12–24 hours).", body: "An itchy, prickly feeling at the edge of the lip. The single best window to start an antiviral cream — applied at the tingle, it can stop the blister forming altogether." },
            { title: "Blister (day 1–3).", body: "Small fluid-filled blisters appear and merge. This is the most contagious stage." },
            { title: "Weeping & crusting (day 3–7).", body: "The blister bursts and crusts over. Still contagious until fully healed." },
            { title: "Healing (day 7–14).", body: "The crust falls off and the skin underneath repairs. No scar." },
          ]},
          { kind: "prose", title: "What Triggers Them", items: [
            { lead: "Stress, illness and being run-down.", body: "Most common. The immune system briefly drops its guard and the virus surfaces." },
            { lead: "Sun on the lips.", body: "UV reactivates the virus. A holiday in strong sun is a classic trigger." },
            { lead: "Cold weather and chapped lips.", body: "Dry, cracked lip skin is easier for the virus to break through." },
            { lead: "Hormonal changes.", body: "Some people get them around their period." },
            { lead: "A trip to the dentist.", body: "The lip-stretching can occasionally set one off the next day. Tell us if you're prone — we work more carefully." },
          ]},
        ],
        callout: { title: "Why we postpone treatment", body: "If you have an active cold sore, please ring and we'll rebook. Stretching the lip during dental treatment can spread the virus, slow healing, and is uncomfortable for you. We are not annoyed if you reschedule at short notice — we'd much rather see you next week." },
        notice: { title: "Children & first outbreaks", body: "The first time a child meets the virus they sometimes get a much bigger reaction — multiple painful ulcers in the mouth, swollen gums and a fever. It's called primary herpetic gingivostomatitis. It clears in 10–14 days. Soft food, plenty of fluids, paracetamol or ibuprofen for comfort. See a GP if your child is too sore to drink." },
      },
      {
        eyebrow: "Self-Care",
        pageTitle: "Treating & Preventing Cold Sores",
        intro: "Catch them at the tingle and you can often head them off entirely. Once a blister is up, you're shortening — not stopping — the outbreak.",
        sections: [
          { kind: "list", title: "At the First Tingle", items: [
            { title: "Antiviral cream.", tag: "WITHIN 12 HOURS", body: "Aciclovir or penciclovir cream, from any pharmacy. Dab on with a cotton bud — not a finger — five times a day for five days." },
            { title: "Cool compress.", tag: "10 MINS, 3× A DAY", body: "A flannel under cold water. Reduces tingling and swelling." },
            { title: "Don't pick or squeeze.", tag: "ALWAYS", body: "Spreads the virus to other parts of the lip and the eye. Eye herpes is serious — wash hands well after touching the sore." },
          ]},
          { kind: "compare", title: "While It's Active",
            left:  { title: "Helps healing", items: [
              "Vaseline over the crust to stop it cracking.",
              "Painkillers if sore — paracetamol or ibuprofen.",
              "Soft, lukewarm food — avoid citrus and salt.",
              "Washing hands thoroughly after touching it.",
            ]},
            right: { title: "Don't", items: [
              "Kiss anyone, particularly babies and people with weakened immune systems.",
              "Share towels, lipsticks, lip balms, glasses or cutlery.",
              "Have oral sex — the virus also causes genital herpes.",
              "Touch your eye after touching the sore.",
            ]},
          },
          { kind: "list", title: "Preventing the Next One", items: [
            { title: "SPF lip balm in strong sun.", tag: "DAILY ON HOLIDAY", body: "SPF 30+. Reapply often. The single biggest preventive measure." },
            { title: "Sleep, water, easing stress.", tag: "ONGOING", body: "The triggers most under your control." },
            { title: "Replace your toothbrush after a sore heals.", tag: "ONCE", body: "The virus survives briefly on the bristles." },
          ]},
        ],
        noticeBox: { title: "See your GP if you notice:", items: [
          "Cold sores that come back more than 5–6 times a year — antiviral tablets may help.",
          "A cold sore that hasn't healed after 2 weeks.",
          "The eye becoming red, sore or painful — same-day GP, don't wait.",
          "You are pregnant, have eczema, or are on medication that lowers immunity — get advice early.",
        ]},
      },
    ],
  },

  /* ─── 26 · Sensitive Teeth ────────────────────────────────────────────── */
  {
    id: "sensitive-teeth",
    num: "26",
    ref: "PI-SEN-01",
    category: "gum",
    title: "Sensitive Teeth",
    summary: "Why it happens, and the routine that settles it.",
    intro: "That sharp twinge from a cold drink, an ice cream or a breath of cold air. It is one of the most common things we're asked about — and one of the most fixable once we know which kind of sensitivity it is.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          { kind: "numbered", title: "Why Teeth Become Sensitive", items: [
            { title: "Receding gums.", body: "The root has no enamel. As the gum drops back, the root surface (and its tubes) is exposed and reacts to cold and sweet." },
            { title: "Acid wear.", body: "Frequent fizzy drinks, fruit juice, lemon water, fruit teas, wine and reflux all soften enamel and thin it over time." },
            { title: "Brushing too hard.", body: "Especially with a hard-bristled brush. Wears notches into the tooth at the gum line." },
            { title: "Grinding or clenching.", body: "Wears the biting edges flat and exposes the dentine underneath." },
            { title: "Recent treatment.", body: "A new filling, crown or whitening course can leave a tooth sensitive for a few days to a couple of weeks. Usually settles." },
          ]},
          { kind: "prose", title: "Sensitivity That Means Something Else", intro: "Plain sensitivity is a quick zing that disappears the moment the cold is gone. Some patterns aren't that, and those are worth a check-up:", items: [
            { lead: "Lingering pain.", body: "Cold or sweet that aches for more than 30 seconds afterwards. Can mean the nerve inside is inflamed." },
            { lead: "Pain on biting.", body: "One sharp jab as you bite down on something. Often a cracked tooth or a high filling." },
            { lead: "Pain to heat.", body: "Hot tea making one tooth throb. Suggests the nerve, not just the dentine." },
            { lead: "Spontaneous pain.", body: "Pain that wakes you at night, with nothing setting it off. Always book a visit." },
          ]},
        ],
        callout: { title: "What helps most people", body: "For ordinary cold-and-sweet sensitivity: switch to a sensitive toothpaste, brush more gently with a soft brush, lay off the acidic drinks, and wait. Most people see a big improvement within two to four weeks if they stick with it. If it isn't budging, come and see us — there are stronger treatments we can apply." },
        notice: { title: "Using sensitive toothpaste properly", body: "The active ingredient needs time to work. Brush as normal, spit, then smear a bit of the toothpaste onto the sensitive area with a clean finger and leave it there. Don't rinse with water afterwards. Most people who say sensitive toothpaste doesn't work for them are using it like ordinary toothpaste." },
      },
      {
        eyebrow: "Everyday Habits",
        pageTitle: "Settling Sensitive Teeth",
        intro: "Sensitivity rarely fixes itself — but a small handful of changes settle it for most people within a month. Stick with all of them; one alone tends not to be enough.",
        sections: [
          { kind: "list", title: "Daily Routine", items: [
            { title: "Switch to a sensitive toothpaste.", tag: "DAILY", body: "Sensodyne, Colgate Sensitive Pro-Relief or similar. Twice a day, every day. Smear a bit on the sore tooth at bedtime and don't rinse." },
            { title: "Use a soft brush, gently.", tag: "DAILY", body: "Hold the brush like a pen, not a fist. Small circles. The aim is to lift plaque off, not scrub." },
            { title: "Spit, don't rinse.", tag: "DAILY", body: "Lets the toothpaste keep working for hours." },
            { title: "Wait 30–60 minutes after acid before brushing.", tag: "AFTER ACID", body: "Fizzy drinks, fruit, wine, being sick — all soften enamel briefly. Brushing straight after wears it away." },
          ]},
          { kind: "compare", title: "Friendly & Less Friendly",
            left:  { title: "Helps", items: [
              "Drinking acidic drinks through a straw.",
              "Finishing meals with cheese, milk or water.",
              "A nightguard if you grind.",
              "Coming for a check-up if it isn't settling — fluoride varnish or sealants applied at the practice work much faster.",
            ]},
            right: { title: "Makes it worse", items: [
              "Sipping fizzy drinks, fruit juice or lemon water through the day.",
              "Brushing hard with a stiff brush.",
              "Whitening kits while teeth are already sensitive.",
              "Whitening toothpastes — abrasive, and won't lift the underlying colour anyway.",
            ]},
          },
        ],
        noticeBox: { title: "Ring the practice if you notice:", items: [
          "Pain that lingers for more than 30 seconds after the cold drink is gone.",
          "One specific tooth that is much worse than the rest.",
          "Sharp pain on biting, or pain to hot drinks.",
          "Sensitivity that hasn't budged after a month of the routine above.",
        ]},
      },
    ],
  },

  /* ─── 27 · Tooth Grinding (Bruxism) ───────────────────────────────────── */
  {
    id: "bruxism",
    num: "27",
    ref: "PI-BRX-01",
    category: "function",
    title: "Tooth Grinding (Bruxism)",
    summary: "Why it happens, the signs, and what actually works.",
    intro: "A lot of people grind or clench their teeth without knowing it, mostly at night. It is not a habit you choose, and telling someone to stop doesn't work — but protecting the teeth and treating the cause does.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          { kind: "prose", title: "Signs You May Be Grinding", items: [
            { lead: "Headaches first thing in the morning.", body: "Around the temples, like a tight band. The clenching muscle is one of the strongest in the body." },
            { lead: "A sore jaw or face on waking.", body: "Sometimes with clicking or stiffness when you open your mouth." },
            { lead: "Worn, flat or chipped teeth.", body: "Especially the canines and front teeth. We can see this at a check-up before you've noticed." },
            { lead: "Sensitive teeth.", body: "Cold drinks set them off — the protective enamel has been worn down." },
            { lead: "Cracked teeth or fractured fillings.", body: "The recurring pattern in someone in their 30s and 40s with no decay." },
            { lead: "A partner who can hear it.", body: "The classic giveaway. Many night-grinders find out from the person sleeping next to them." },
          ]},
          { kind: "prose", title: "Why It Happens", items: [
            { lead: "", body: "Grinding is rarely about the bite alone. The most common drivers are stress and anxiety, broken sleep, alcohol, caffeine and some medications. Reflux at night also sets it off in some people. Often it's a combination — and the mix changes through a person's life." },
          ]},
          { kind: "numbered", title: "What We Can Do", items: [
            { title: "A custom nightguard (occlusal splint).", body: "A thin clear plastic guard worn at night. It doesn't stop the grinding, but the teeth grind on the splint instead of each other. The splint slowly wears down — that's its job. We replace it every few years." },
            { title: "Repair what's already worn.", body: "Where teeth are short, sensitive or cracking, we can build them back up with composite. Done before things break is far simpler than after." },
            { title: "Address the cause where we can.", body: "That might mean working through the daytime triggers (caffeine after lunch, screen time before bed), looking at sleep, or — for some patients — a referral to a GP for stress or sleep issues." },
          ]},
        ],
        callout: { title: "Why a shop-bought guard isn't the same", body: "Boil-and-bite guards from the chemist are bulky, sit awkwardly, and most people give up on them within weeks. A custom guard is thin, comfortable to sleep in and the right thickness to take the load — and we can adjust it if anything feels off. The cost difference is real but so is the wear-and-tear difference." },
        notice: { title: "If you grind in the day too", body: "Daytime clenching is common at desks and behind the wheel. The cue we suggest: lips together, teeth apart. Stick a small dot somewhere you'll see often (the corner of a screen, the dashboard) — every time you notice it, check your jaw and unclench." },
      },
      {
        eyebrow: "Everyday Habits",
        pageTitle: "Reducing the Grind",
        intro: "These are the habits that have the best evidence behind them. Most people don't need all of them — pick the two or three that look most likely to apply to you and start there.",
        sections: [
          { kind: "list", title: "Wind-Down for Sleep", items: [
            { title: "No caffeine after lunchtime.", tag: "DAILY", body: "Caffeine has a half-life of around five hours — a 3pm coffee is still working at bedtime." },
            { title: "Limit alcohol before bed.", tag: "EVENINGS", body: "Alcohol fragments sleep and is one of the strongest triggers for night grinding." },
            { title: "Wind down for 30 minutes before sleep.", tag: "EVENINGS", body: "Off the phone, lights low. Reading or a warm shower works for most people." },
            { title: "Wear the splint every night.", tag: "ONCE MADE", body: "Even on holiday. The teeth do most of their wear in the small hours." },
          ]},
          { kind: "list", title: "For the Day", items: [
            { title: "Lips together, teeth apart.", tag: "CUE", body: "The natural rest position. Teeth should only touch when chewing or swallowing. A small sticker on your screen can be the reminder." },
            { title: "Avoid chewing gum and hard foods if jaw is sore.", tag: "FLARE-UPS", body: "The jaw needs a break, not more exercise." },
            { title: "Warm flannel on the cheeks.", tag: "MORNINGS", body: "Helps tight muscles let go. Five to ten minutes is enough." },
            { title: "Gentle jaw stretches.", tag: "DAILY", body: "Open as wide as comfortable, hold for five seconds, close. Repeat ten times. Then side-to-side. Stop short of pain." },
          ]},
          { kind: "compare", title: "Friendly & Less Friendly",
            left:  { title: "Helps", items: [
              "Custom nightguard, worn nightly.",
              "Treating reflux if you have it.",
              "Talking to your GP if stress or sleep are part of the picture.",
              "Regular check-ups so we can see wear early.",
            ]},
            right: { title: "Less helpful", items: [
              "Boil-and-bite guards as a long-term solution.",
              "Chewy sweets and gum if the jaw is already sore.",
              "Late caffeine and late alcohol.",
              "Resting on the jaw with a hand or a pillow that pushes it sideways.",
            ]},
          },
        ],
        noticeBox: { title: "Ring the practice if you notice:", items: [
          "A tooth that feels different to bite on, or starts hurting on chewing.",
          "A chipped or cracked tooth, or a filling that has come out.",
          "Jaw locking, severe pain on opening, or being unable to open or close.",
          "Headaches several mornings a week despite using the splint.",
        ]},
      },
    ],
  },

  /* ─── 28 · Jaw Pain & Clicking (TMD) ──────────────────────────────────── */
  {
    id: "tmd",
    num: "28",
    ref: "PI-TMD-01",
    category: "function",
    title: "Jaw Pain & Clicking",
    summary: "What people notice, what causes it, and what settles it.",
    intro: "The temporo-mandibular joint (TMJ) is one of the most-used joints in the body — it moves every time you talk, eat or yawn. When it complains, it shows up as clicking, soreness around the ear, headaches, or a jaw that won't open as wide as it used to. Most cases settle with simple measures.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          { kind: "numbered", title: "What People Notice", items: [
            { title: "Clicking or popping when opening the mouth.", body: "The most common symptom. The disc inside the joint moves a fraction late. Painless clicking on its own usually doesn't need any treatment." },
            { title: "Aching around the ear, jaw or temple.", body: "Worse first thing in the morning (from grinding overnight) or by the end of a stressful day." },
            { title: "Headaches and tight temples.", body: "The big chewing muscles run up the side of the head. Tension headaches are often jaw-related and not recognised as such." },
            { title: "Jaw locking or limited opening.", body: "The mouth won't open as wide as before, or briefly catches on opening. Worth a check." },
          ]},
          { kind: "prose", title: "What's Behind It", items: [
            { lead: "Clenching and grinding.", body: "The biggest single factor. Often happens overnight without you knowing. See our Tooth Grinding leaflet." },
            { lead: "Stress.", body: "Carried in the jaw for many people. Symptoms wax and wane with what's going on in life." },
            { lead: "Bite changes.", body: "A new high filling, a missing back tooth that has shifted things, or a recent denture." },
            { lead: "Habits we don't notice.", body: "Chewing gum constantly, biting nails, resting the chin on a hand, sleeping face-down. They all load the joint." },
            { lead: "An old injury.", body: "A blow to the jaw years ago can leave the joint sensitive for life." },
          ]},
        ],
        callout: { title: "The reassuring bit", body: "The vast majority of jaw-joint problems settle with simple measures over a few weeks — soft food, painkillers, gentle exercises, a nightguard. Surgery is almost never the answer. We start with the easiest things and only escalate if they don't do the job." },
        notice: { title: "Painkillers", body: "Ibuprofen at full anti-inflammatory dose for a week (with food, if your stomach tolerates it) is more effective than paracetamol for jaw pain. Always check this is safe for you, particularly if you take blood thinners or have a sensitive stomach." },
      },
      {
        eyebrow: "Self-Care",
        pageTitle: "Settling the Jaw",
        intro: "Most jaw pain settles within 3–6 weeks of resting the joint and changing a few small habits. Stick with all of them — one alone usually isn't enough.",
        sections: [
          { kind: "list", title: "Resting the Joint", items: [
            { title: "Soft food for 2–3 weeks.", tag: "DAILY", body: "Soup, pasta, fish, scrambled egg, soft fruit. Cut food into small pieces." },
            { title: "Lips together, teeth apart.", tag: "ALL DAY", body: "The natural rest position. Teeth should only touch when chewing or swallowing — for many people that's less than 10 minutes a day." },
            { title: "Warm compress on the cheek.", tag: "15 MINS, 2× A DAY", body: "A microwaveable wheat bag or a warm flannel. Eases muscle tightness." },
            { title: "Don't open wide.", tag: "A FEW WEEKS", body: "Cut sandwiches, eat burgers with a knife and fork, support the chin when yawning." },
          ]},
          { kind: "compare", title: "Habits Worth Changing",
            left:  { title: "Helps", items: [
              "Sleep on your back or side, not face-down.",
              "A nightguard if you grind — see us for a custom one.",
              "Gentle jaw stretches twice a day (we'll show you).",
              "Anything that lowers stress — exercise, sleep, time off screens.",
            ]},
            right: { title: "Loads the joint", items: [
              "Chewing gum, biting nails, chewing pen lids.",
              "Crunchy foods — apples whole, baguettes, hard nuts.",
              "Resting the chin on a hand at the desk.",
              "Holding a phone between ear and shoulder.",
            ]},
          },
        ],
        noticeBox: { title: "Ring the practice if you notice:", items: [
          "The jaw locks open or closed and won't move.",
          "Pain that is severe, getting worse, or waking you at night.",
          "Mouth opening that has noticeably reduced over a few weeks.",
          "A bite that has changed — back teeth no longer meet, or one side hits first.",
          "Numbness or weakness in the face — call your GP rather than wait.",
        ]},
      },
    ],
  },

  /* ─── 29 · Sports Mouthguards ─────────────────────────────────────────── */
  {
    id: "sports-mouthguards",
    num: "29",
    ref: "PI-MGD-01",
    category: "function",
    title: "Sports Mouthguards",
    summary: "Why custom matters, who needs one, and how to care for it.",
    intro: "A custom-made mouthguard absorbs the energy of a knock to the face and spreads it across the whole arch instead of one tooth. They reduce dental injuries in contact sports by around 60% — and a knocked-out front tooth costs more, in time and money, than a lifetime of mouthguards.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          { kind: "numbered", title: "Three Kinds — and Why They're Not Equal", items: [
            { title: "Stock mouthguards.", body: "Pre-formed, one-size-fits-most. Cheap, available at any sports shop. Bulky, often have to be held in place with the teeth, and offer the least protection. Better than nothing, just." },
            { title: "Boil-and-bite.", body: "Soften in hot water, bite into them. Better fit than stock, and a reasonable choice for casual sport. Wear out within a season, and don't cover the back teeth properly." },
            { title: "Custom-made (laboratory).", body: "Made from an impression or scan of your teeth. Thinner where it can be, thicker where impact is likely, and stays put without you having to bite. Easier to talk and breathe in. Lasts 2–3 seasons. Strongly recommended for any contact sport." },
          ]},
          { kind: "prose", title: "Who Needs One", items: [
            { lead: "Contact sports — at any age.", body: "Rugby, hockey, boxing, martial arts, lacrosse, water polo. Many leagues require them." },
            { lead: "Sports with a hard ball, stick or floor.", body: "Cricket, hockey, basketball, skateboarding, BMX, equestrian. Often missed until the first injury." },
            { lead: "Football.", body: "Not contact in the traditional sense, but heading and elbows do plenty of damage. Worth considering, especially for children." },
            { lead: "Anyone with braces.", body: "Brackets cut the inside of the lip on impact. There are guards designed to fit over braces — ask us if your child plays sport." },
          ]},
        ],
        callout: { title: "Children outgrow them", body: "A child whose adult teeth are still coming through will outgrow a mouthguard within a season or two. Plan for replacement around the start of each new sports year — not because the guard is worn out, but because the mouth has moved." },
        notice: { title: "Cost vs risk", body: "A custom mouthguard at our practice costs roughly the same as a single appointment to repair a chipped front tooth — and a tenth of what it costs to replace a knocked-out tooth properly. Multiply that by the next 60 years and it pays for itself many times over." },
      },
      {
        eyebrow: "Looking After Yours",
        pageTitle: "Looking After a Mouthguard",
        intro: "A custom mouthguard lasts 2–3 seasons of regular use. A few simple habits keep it doing its job — and stop it growing the kind of bacteria you don't want in your mouth.",
        sections: [
          { kind: "list", title: "Routine", items: [
            { title: "Rinse before and after every use.", tag: "EACH TIME", body: "Cool water — never hot." },
            { title: "Brush gently with a soft brush.", tag: "AFTER EACH USE", body: "Plain soap and water, or a small amount of toothpaste. Then rinse thoroughly." },
            { title: "Soak weekly in a denture-cleansing tablet.", tag: "ONCE A WEEK", body: "Steradent or similar in cool water. Removes bacteria a quick rinse misses." },
            { title: "Store dry, in its case.", tag: "BETWEEN USES", body: "The case should have air holes — wet plastic in a sealed bag goes mouldy fast." },
            { title: "Bring it to your check-up.", tag: "EVERY 6 MONTHS", body: "We check the fit and condition. Particularly important for children." },
          ]},
          { kind: "compare", title: "Helps & Don't",
            left:  { title: "Helps it last", items: [
              "Cool water rinses and gentle brushing.",
              "Vented case, kept somewhere cool.",
              "Replacing it when the bite changes (kids/teens) or it shows wear.",
            ]},
            right: { title: "Ruins it", items: [
              "Hot water, the dishwasher, the radiator, a sunny windowsill — heat warps it.",
              "Chewing on it during play.",
              "Sharing with a teammate. Each mouth is unique.",
              "Storing wet in a kit bag — bacterial paradise.",
            ]},
          },
        ],
        noticeBox: { title: "Ring the practice if:", items: [
          "The mouthguard no longer fits — slips, doesn't cover all the teeth, or is uncomfortable.",
          "You take a knock to the face — even if the teeth seem fine. Some injuries show up days later.",
          "An adult tooth is knocked out — same-day call, see our Emergencies leaflet.",
          "A bracket has come loose during play.",
        ]},
      },
    ],
  },

  /* ─── 30 · Snoring & Sleep Apnoea ─────────────────────────────────────── */
  {
    id: "sleep-apnoea",
    num: "30",
    ref: "PI-SLP-01",
    category: "function",
    title: "Snoring & Sleep Apnoea",
    summary: "Telling the two apart — and a dental device that can help.",
    intro: "Snoring is a soft-tissue noise from the back of the throat narrowing during sleep. For most people it's harmless, if irritating to a partner. For some, it's the outward sign of something more serious — obstructive sleep apnoea — where the airway closes completely for short periods through the night.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          { kind: "numbered", title: "Snoring vs Sleep Apnoea", items: [
            { title: "Plain snoring.", body: "Steady, vibrating, no pauses. Sleep is uninterrupted, you wake refreshed. Often worse on your back, after alcohol, or when you have a cold." },
            { title: "Sleep apnoea.", body: "Snoring with pauses — usually 10 seconds or more — followed by a gasp or choke. Partners often spot it first. You wake feeling unrefreshed even after eight hours." },
            { title: "Daytime tiredness.", body: "Falling asleep in front of the TV, while reading, in meetings, at the wheel. Concentration goes. Mood drops. The single most useful symptom to flag to a GP." },
          ]},
          { kind: "prose", title: "Why It Matters", items: [
            { lead: "Tiredness and accidents.", body: "Untreated apnoea raises the risk of road accidents several-fold. The DVLA needs to be told if you have moderate or severe apnoea." },
            { lead: "High blood pressure and heart strain.", body: "Each apnoea event briefly drops oxygen and raises blood pressure. Over years, this adds up." },
            { lead: "A dry mouth and decay risk.", body: "Sleeping with the mouth open dries out the front teeth and accelerates decay at the gum line." },
            { lead: "Tooth grinding.", body: "Many apnoea patients grind heavily at night — the body's response to the airway closing. Worn front teeth or a sore jaw can be the first clue we spot." },
          ]},
          { kind: "prose", title: "The Dental Side", items: [
            { lead: "", body: "For mild-to-moderate snoring and apnoea, a custom-made mandibular advancement device (MAD) is one of the options. It looks like two thin gumshields joined together — worn at night, it gently holds the lower jaw forward, which keeps the airway open. Effective for around two-thirds of suitable patients. We make it on referral or after a sleep study." },
          ]},
        ],
        callout: { title: "The right order", body: "For loud snoring with no apnoea symptoms, the device can be made by us directly. For anything that sounds like apnoea — pauses, gasps, daytime tiredness — please see your GP first. They can refer you to a sleep clinic for a study (usually a small home device worn for one night). Treating apnoea without diagnosing it first can mask a serious problem." },
        notice: { title: "The easy wins first", body: "Before any device, a few simple changes help most snorers: lose a stone if you're carrying it, sleep on your side rather than your back, avoid alcohol within 3 hours of bed, treat hayfever and a blocked nose, and stop smoking. They sound mundane and they work." },
      },
      {
        eyebrow: "Aftercare",
        pageTitle: "Living With a Mandibular Device",
        intro: "It takes a couple of weeks to settle in. Most patients are sleeping comfortably in it within a fortnight, and partners notice a quieter night well before then.",
        sections: [
          { kind: "list", title: "The First Two Weeks", items: [
            { title: "Build up gradually.", tag: "FEW HOURS THEN FULL NIGHT", body: "Wear it for an hour or two in the evening before sleeping in it. Lets the brain learn the new position." },
            { title: "Jaw stiffness in the morning.", tag: "FIRST 1–2 WEEKS", body: "Common, settles. Gentle jaw stretches and a warm flannel on the cheek help." },
            { title: "Extra saliva at first.", tag: "A WEEK", body: "The mouth treats the device like food. Settles within a few nights." },
            { title: "Bite feels a bit \"off\" for 30 minutes after.", tag: "EACH MORNING", body: "Normal. The bite returns. Some morning exercises help — we'll show you." },
          ]},
          { kind: "compare", title: "Daily Care",
            left:  { title: "Helps it last", items: [
              "Rinse and brush gently each morning with cool water and soap.",
              "Soak weekly in a denture-cleansing tablet.",
              "Store dry in its case, somewhere cool.",
              "Bring it to your check-up — we'll inspect the fit.",
            ]},
            right: { title: "Damages it", items: [
              "Hot water and the dishwasher (warps it).",
              "Toothpaste — abrasive on the polished surface.",
              "Bleach.",
              "Sleeping in it without cleaning daily.",
            ]},
          },
        ],
        noticeBox: { title: "Ring the practice — or your GP — if:", items: [
          "Snoring or pauses haven't improved after 4–6 weeks of using the device nightly.",
          "Daytime tiredness is severe, or you've fallen asleep at the wheel.",
          "The device causes lasting jaw pain that doesn't settle within an hour of waking.",
          "The bite has changed permanently — back teeth no longer meet on biting down.",
          "The device cracks, or the connector loosens.",
        ]},
      },
    ],
  },

  /* ─── 31 · Fissure Sealants ───────────────────────────────────────────── */
  {
    id: "fissure-sealants",
    num: "31",
    ref: "PI-PED-02",
    category: "function",
    title: "Fissure Sealants",
    summary: "A quick painless seal that prevents decay in the deep grooves of new molars.",
    intro: "Once your child's permanent back teeth start to come through, around the age of six, we may suggest fissure sealants. They are a quick, painless way to protect the deepest grooves on those new teeth before any decay can start.",
    pages: [
      {
        eyebrow: "Information for Parents",
        sections: [
          { kind: "prose", title: "What Are Fissure Sealants?", items: [
            { lead: "", body: "The chewing surfaces of the back teeth aren't flat — they're textured with deep grooves and pits called fissures. These grooves can be narrower than a single toothbrush bristle, which makes them a perfect trap for food, plaque and the bacteria that cause cavities." },
            { lead: "", body: "A sealant is a thin, tooth-coloured resin coating that flows into those grooves and sets hard, sealing them off. With the surface smooth and protected, brushing can do its job properly. Studies have shown sealants reduce decay in back teeth by up to 80% in the first two years, with strong protection lasting much longer." },
          ]},
          { kind: "prose", title: "Who Are They For?", intro: "Sealants are usually placed on the permanent (adult) molars soon after they erupt — so the surface is sealed before decay has a chance to start. The typical timeline is:", items: [
            { lead: "First permanent molars.", body: "Erupt around age 6–7. Sealed soon after." },
            { lead: "Premolars.", body: "Erupt around age 9–11. Sealed if grooves are deep." },
            { lead: "Second permanent molars.", body: "Erupt around age 11–14. Sealed soon after." },
            { lead: "", body: "Sealants are also a good option for older children, teenagers and even adults who have deep fissures or a higher risk of decay." },
          ]},
          { kind: "numbered", title: "The Procedure: Step by Step", items: [
            { title: "Clean and dry the tooth.", body: "The tooth is gently cleaned and isolated so it stays dry — a clean, dry surface is what makes the sealant bond." },
            { title: "Apply the etch gel.", body: "A mildly tangy gel is painted on for a few seconds to roughen the enamel surface. It's then rinsed off and the tooth is dried again." },
            { title: "Paint on the sealant.", body: "The liquid sealant is flowed into the grooves with a fine brush — nothing sharp, nothing buzzing." },
            { title: "Set with a bright light.", body: "A blue curing light is held over the tooth for about 20 seconds, hardening the sealant instantly. Your child can eat and drink straight away." },
          ]},
        ],
        callout: { title: "What it's like for your child", body: "Sealing one tooth takes a few minutes. There are no injections, no drilling, and no healthy tooth is removed. Your child sits back, the tooth is cleaned and painted, and a small blue light is held over it." },
        notice: { title: "A note on safety", body: "Modern dental sealants are tested to strict safety standards. The amount of any chemical released is far below safe-exposure limits set by health authorities, and the long-term protection sealants provide far outweighs any theoretical concern." },
      },
      {
        eyebrow: "Aftercare & FAQs",
        pageTitle: "Looking After Your Child's Sealants",
        intro: "Sealants are tough, but they're still a thin coating sitting on top of a tooth. A few small habits will keep them working hard for years — and we'll keep an eye on them at every visit.",
        sections: [
          { kind: "list", title: "Straight After the Appointment", items: [
            { title: "Eat and drink as normal.", tag: "IMMEDIATELY", body: "The sealant is fully hardened by the curing light, so there's no waiting period." },
            { title: "Expect a slightly \"new\" feel.", tag: "FIRST 24 HRS", body: "The bite may feel a touch different at first. If it still feels high after a day, call us — we can adjust it in a couple of minutes." },
            { title: "Keep brushing as usual.", tag: "TWICE DAILY", body: "Sealants protect the chewing surface, but plaque still gathers between teeth and along the gumline. Brushing and flossing matter just as much." },
          ]},
          { kind: "compare", title: "Helping Sealants Last",
            left:  { title: "Do", items: [
              "Brush twice daily with fluoride toothpaste — sealants and fluoride work as a team.",
              "Bring your child for routine check-ups every 6–12 months so we can review the sealants.",
              "Limit sugary drinks and snacks to mealtimes.",
              "Encourage \"spit, don't rinse\" after brushing.",
            ]},
            right: { title: "Avoid", items: [
              "Chewing ice, hard sweets or pen lids — they can chip the sealant.",
              "Sticky toffees and chewing gum that can pull at the edges.",
              "Skipping check-ups — worn sealants are easy to top up early, harder later.",
              "Assuming sealed teeth can't decay — between-tooth surfaces still need brushing and flossing.",
            ]},
          },
          { kind: "list", title: "Common Questions", items: [
            { title: "How long do sealants last?", tag: "5–10 YRS+", body: "Most sealants last well into the teenage years. We check them at every routine visit and can top them up easily if they show wear." },
            { title: "Will my child see them when they smile?", tag: "NO", body: "Sealants are clear or tooth-coloured, and they're only placed on the chewing surfaces of the back teeth." },
            { title: "Can a tooth still get a cavity if it's sealed?", tag: "RARELY", body: "The sealed surface is well protected, but the sides between teeth still need brushing and flossing to stay cavity-free." },
            { title: "What about fluoride varnish?", tag: "BELT & BRACES", body: "Sealants and fluoride varnish protect different parts of the tooth and work brilliantly together. Many children have both." },
          ]},
        ],
        noticeBox: { title: "Call the practice if you notice:", items: [
          "A rough patch or a piece of sealant that has come away.",
          "The bite feeling \"high\" more than 24 hours after the appointment.",
          "New sensitivity to hot, cold or sweet on a sealed tooth.",
          "A dark line or shadow appearing on a sealed tooth.",
        ]},
      },
    ],
  },

  /* ─── 32 · Diabetes & Your Mouth ──────────────────────────────────────── */
  {
    id: "diabetes",
    num: "32",
    ref: "PI-DBT-01",
    category: "groups",
    title: "Diabetes & Your Mouth",
    summary: "The two-way link between blood sugar and gum disease.",
    intro: "Diabetes and gum disease are linked in both directions. Higher blood sugar makes gum problems more likely, and untreated gum disease makes blood sugar harder to control. Looking after one helps the other.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          { kind: "numbered", title: "What Diabetes Does in the Mouth", items: [
            { title: "Gum disease.", body: "People with diabetes are around three times more likely to develop gum disease, and it tends to progress faster. Gums bleed, recede and the bone around the teeth is lost, eventually leading to teeth becoming loose." },
            { title: "Slower healing.", body: "Cuts in the mouth, ulcers, and the area after an extraction all take longer to heal when blood sugar is high." },
            { title: "Dry mouth and oral thrush.", body: "Higher sugar levels in saliva, lower flow, and a slightly weaker immune response. Together they can lead to a dry, sore mouth and white patches that wipe off (oral thrush)." },
            { title: "More decay.", body: "Especially at the gum line where roots become exposed. Frequent snacks to manage low sugars, if not balanced with brushing, also feed the bacteria that cause decay." },
          ]},
          { kind: "prose", title: "And the Other Way Round", items: [
            { lead: "", body: "Treating gum disease — proper deep cleaning by a hygienist, plus the right home care — is now well evidenced to lower HbA1c by a small but meaningful amount over a few months. It is one of the few things outside diet, medication and exercise that genuinely moves the dial." },
          ]},
          { kind: "prose", title: "What to Tell Us", items: [
            { lead: "That you have diabetes, and which type.", body: "And whether you are on tablets, insulin, or both." },
            { lead: "Your most recent HbA1c if you know it.", body: "It helps us plan treatment safely. We can also write to your GP for it if needed." },
            { lead: "Whether you've had hypos recently.", body: "Particularly if they've been unexpected. We'll plan appointments accordingly and keep glucose to hand." },
            { lead: "Any new medications.", body: "Some affect bleeding, dry mouth, or healing. Always useful for us to know." },
          ]},
        ],
        callout: { title: "The two-way street", body: "If you've been told your blood sugar control is borderline and you also have bleeding gums, treating the gums is one of the most useful things you can do. Talk to us at your next visit." },
        notice: { title: "Booking appointments", body: "Mid-morning is usually the best time — well after breakfast and your morning insulin, well before lunch. Eat as normal and take your medication as normal unless we've specifically told you otherwise. Bring something sugary in case of a hypo." },
      },
      {
        eyebrow: "Everyday Habits",
        pageTitle: "Daily Care with Diabetes",
        intro: "Nothing in this list is unique to diabetes — it's the standard advice, done a bit more carefully and a bit more often. The combination is what makes the difference.",
        sections: [
          { kind: "list", title: "Daily Routine", items: [
            { title: "Brush twice a day with fluoride toothpaste.", tag: "DAILY", body: "Two minutes, last thing at night and one other time. A soft electric brush with a small head reaches more." },
            { title: "Clean between the teeth once a day.", tag: "DAILY", body: "Floss or interdental brushes. Bleeding here is the gums asking for more, not less. It usually settles within a fortnight." },
            { title: "Spit, don't rinse, after brushing.", tag: "DAILY", body: "Leaves the fluoride doing its job for hours." },
            { title: "Drink water through the day.", tag: "DAILY", body: "Helps with dry mouth and clears sugary residue from snacks." },
            { title: "See the hygienist every 3–6 months.", tag: "REGULAR", body: "More often than the once-a-year norm. The single most useful thing on this list for someone with diabetes." },
          ]},
          { kind: "compare", title: "Eating & Snacking",
            left:  { title: "Tooth-friendly", items: [
              "Cheese, plain yoghurt, nuts and unsweetened oatcakes for snacks.",
              "Water or plain milk between meals.",
              "Sugar-free gum after meals.",
              "Treating hypos with the smallest dose of glucose that works, then a small protein snack.",
            ]},
            right: { title: "Less friendly", items: [
              "Sipping fruit juice or glucose drinks through the day \"just in case\".",
              "Sugar-rich \"diabetic\" biscuits and bars — most are still bad for teeth.",
              "Smoking — adds the same gum and healing problems on top.",
              "Skipping check-ups because nothing hurts — gum disease in diabetes often doesn't until late.",
            ]},
          },
        ],
        noticeBox: { title: "Ring the practice if you notice:", items: [
          "Gums that bleed every time you brush, or that look puffy and shiny.",
          "Teeth feeling longer, drifting, or any tooth feeling loose.",
          "White patches inside the mouth that wipe off (possible thrush).",
          "An ulcer or sore that has not healed in two weeks.",
          "A cut, extraction or surgical site that is taking longer than expected to heal.",
        ]},
      },
    ],
  },

  /* ─── 33 · Heart Conditions & Dental Care ─────────────────────────────── */
  {
    id: "heart-conditions",
    num: "33",
    ref: "PI-CRD-01",
    category: "groups",
    title: "Heart Conditions & Dental Care",
    summary: "Blood thinners, antibiotic cover, and the gum-heart link.",
    intro: "Most patients with heart conditions have routine dental treatment perfectly safely — sometimes with small adjustments. The main things we need to know are what condition you have, what medications you take, and when anything has changed.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          { kind: "numbered", title: "Always Tell Us", items: [
            { title: "Any heart condition you've been diagnosed with.", body: "Angina, a previous heart attack, atrial fibrillation, heart failure, valve problems, congenital conditions — all relevant." },
            { title: "Anything fitted in the heart.", body: "A stent, pacemaker, defibrillator (ICD), replacement heart valve, or repair using a graft. The date and the hospital matter." },
            { title: "Your full medication list.", body: "Bring an up-to-date prescription print-out. Blood thinners, blood-pressure medications, statins and any new prescriptions all change how we plan treatment." },
            { title: "Recent events.", body: "A heart attack, stroke, new chest pains, a hospital stay, or a change in medication in the last six months." },
          ]},
          { kind: "prose", title: "Blood Thinners", items: [
            { lead: "", body: "If you take warfarin, apixaban, rivaroxaban, dabigatran, edoxaban or clopidogrel — keep taking them as prescribed. We almost never ask patients to stop. Stopping a blood thinner has a higher risk than the bleeding from a routine extraction. For warfarin, we may ask you to bring a recent INR (within 72 hours, ideally below 4). We use local measures (gauze, sutures, gentle technique) to manage bleeding." },
          ]},
          { kind: "prose", title: "Antibiotic Cover", items: [
            { lead: "Most patients no longer need it.", body: "NICE guidance from 2008 changed how we approach this. Routine antibiotic cover before dental treatment is no longer recommended for most heart conditions." },
            { lead: "A small group still benefit.", body: "Patients with a history of bacterial endocarditis, a prosthetic heart valve, certain congenital conditions, and some heart transplant patients. Your cardiologist will have flagged this." },
            { lead: "If you're unsure — ask your cardiologist.", body: "Or have a copy of any letter that mentions antibiotic cover. Bring it to your appointments and we'll work from there." },
          ]},
        ],
        callout: { title: "Gum disease and the heart", body: "There's growing evidence that the inflammation of gum disease contributes to inflammation in blood vessels — and that treating one helps the other. For heart patients particularly, keeping the gums healthy is one of the simplest things you can do for your overall cardiovascular health. Hygienist visits are not cosmetic; they are part of looking after a heart condition." },
        notice: { title: "Bring your GTN spray", body: "If you have angina, please bring your spray to every appointment and let us know on arrival. We'll check it's within reach during treatment. Most appointments go fine — but the five seconds it takes to mention is worth it." },
      },
      {
        eyebrow: "At Your Appointment",
        pageTitle: "Planning Treatment Around Your Heart",
        intro: "A few small adjustments make most appointments smoother. The points below cover the questions we ask patients with heart conditions, and what to expect.",
        sections: [
          { kind: "list", title: "Before You Come", items: [
            { title: "Bring an up-to-date medication list.", tag: "EACH VISIT", body: "From your GP surgery's online portal or repeat-prescription slip." },
            { title: "Eat normally and take your usual medications.", tag: "DAY OF VISIT", body: "Don't skip them unless we've specifically asked you to." },
            { title: "Bring your GTN spray, inhaler or any rescue medications.", tag: "EACH VISIT", body: "Tell reception when you arrive." },
            { title: "Mid-morning appointments suit most.", tag: "WHEN BOOKING", body: "Heart-related events are slightly more common in the early morning. A 10–11am appointment is often a calmer time." },
            { title: "If your INR is being checked, bring the latest result.", tag: "WITHIN 72 HRS OF A PROCEDURE", body: "For warfarin patients only." },
          ]},
          { kind: "list", title: "During the Appointment", items: [
            { title: "Local anaesthetic is usually fine.", tag: "ROUTINE", body: "The dose of adrenaline in dental local is small. We sometimes use an adrenaline-free version for patients with unstable angina or recent heart attack." },
            { title: "Tell us if anything feels off.", tag: "ANYTIME", body: "Chest tightness, breathlessness, dizziness — raise a hand and we'll stop. Better to pause and check than push through." },
            { title: "Sit up slowly at the end.", tag: "AFTER TREATMENT", body: "Helps avoid the dizziness some heart patients get on standing." },
          ]},
        ],
        noticeBox: { title: "Tell us — or your GP — if you notice:", items: [
          "Bleeding gums that aren't settling, especially if you're on blood thinners.",
          "Swelling, infection or a tooth abscess — these can affect heart conditions and need prompt treatment.",
          "A new heart medication or a change in dose since we last saw you.",
          "Anything from your cardiologist that mentions antibiotic cover for dental work.",
        ]},
      },
    ],
  },

  /* ─── 34 · Cancer Treatment & Your Mouth ──────────────────────────────── */
  {
    id: "cancer-treatment",
    num: "34",
    ref: "PI-ONC-01",
    category: "groups",
    title: "Cancer Treatment & Your Mouth",
    summary: "Before, during and after chemo, radiotherapy or bone-strengthening medications.",
    intro: "Chemotherapy, radiotherapy and bone-strengthening medications all affect the mouth — sometimes a lot. With a little planning before treatment starts, and the right routine during it, most of the side-effects can be managed and the worst ones avoided altogether.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          { kind: "numbered", title: "Before Treatment Begins", items: [
            { title: "Tell us as soon as you know.", body: "Ideally before the first chemotherapy or radiotherapy session, ideally before any bisphosphonate or denosumab injection. We need 2–3 weeks if possible." },
            { title: "A thorough check-up and clean.", body: "We sort out anything that's likely to cause trouble during treatment — extractions, deep fillings, sharp edges. Once treatment starts, doing those things becomes much harder." },
            { title: "Coaching on prevention.", body: "You'll switch to high-fluoride toothpaste (2,800 or 5,000 ppm on prescription), a soft brush, and a daily routine designed to protect against the dry mouth that follows." },
          ]},
          { kind: "prose", title: "During Treatment", items: [
            { lead: "Mouth ulcers and soreness (mucositis).", body: "Common with chemotherapy and head-and-neck radiotherapy. Salt and bicarbonate rinses (a teaspoon of each in a pint of warm water) used 4–6 times a day reduce it. Difflam mouthwash for stronger pain." },
            { lead: "Dry mouth (xerostomia).", body: "Especially with head-and-neck radiotherapy, and often permanent. See our Dry Mouth leaflet. Sip water all day, sugar-free gum, and saliva substitutes from the pharmacy." },
            { lead: "Oral thrush.", body: "White patches that wipe off, leaving a sore base. Common during chemo. Tell your oncology team — easily treated with antifungal drops." },
            { lead: "Taste changes.", body: "Food tasting metallic or bland. Usually returns within months of finishing treatment." },
          ]},
        ],
        callout: { title: "If you are on bisphosphonates or denosumab", body: "These bone-strengthening medications (Alendronate, Zometa, Prolia and others) affect how the jawbone heals after extractions. The risk of a slow-healing socket — medication-related osteonecrosis — is small but real. We need to know which medication you're on, when it started, and how it's given (tablets vs injection). We do everything possible to avoid extractions in patients on these drugs, and where we can't, we plan them carefully with your oncologist." },
        notice: { title: "Always bring", body: "A list of your medications, the name of your oncology team, the date your treatment started, and any letters about your bone-strengthening medications. We share information with your hospital team where it helps." },
      },
      {
        eyebrow: "Everyday Care",
        pageTitle: "Caring for Your Mouth During Treatment",
        intro: "A simple, gentle routine — done consistently — keeps the mouth as comfortable as possible and prevents most of the longer-term damage.",
        sections: [
          { kind: "list", title: "Daily Routine", items: [
            { title: "Brush twice a day with a very soft brush.", tag: "MORNING & NIGHT", body: "High-fluoride toothpaste on prescription. Pea-sized amount, gentle pressure, two minutes. Spit, don't rinse." },
            { title: "Salt & bicarbonate rinses.", tag: "4–6× A DAY", body: "Teaspoon of salt and teaspoon of baking soda in a pint of warm water. Soothes ulcers and keeps the mouth clean." },
            { title: "Sip water all day.", tag: "CONSTANTLY", body: "Small frequent sips beat occasional gulps. A water bottle by the bed for the night." },
            { title: "Sugar-free gum or lozenges.", tag: "AS NEEDED", body: "Stimulates saliva. Xylitol versions also help against decay." },
            { title: "Lip balm with SPF.", tag: "DAILY", body: "Lips dry and crack easily. Plain Vaseline or a fragrance-free balm." },
          ]},
          { kind: "compare", title: "Helps & Avoid",
            left:  { title: "Helps", items: [
              "Soft, lukewarm food when the mouth is sore.",
              "Smoothies, soups, scrambled egg, mashed potato.",
              "Saliva substitutes from a pharmacy if dry mouth is severe.",
              "Telling us promptly about anything new — we'd rather see you than have you put up with it.",
            ]},
            right: { title: "Best avoided", items: [
              "Alcohol-based mouthwashes (sting, dry the mouth).",
              "Spicy, salty, acidic or very hot food.",
              "Crusty bread, crisps, sharp-edged foods.",
              "Smoking and alcohol — both delay healing.",
            ]},
          },
        ],
        noticeBox: { title: "Ring the practice if you notice:", items: [
          "An ulcer that hasn't healed after two weeks.",
          "White patches that wipe off (likely thrush) — your oncology team can prescribe.",
          "Severe mouth pain that is stopping you eating or drinking.",
          "A loose tooth or exposed bone showing through the gum.",
          "Any swelling or infection — these can move quickly during chemotherapy.",
        ]},
      },
    ],
  },

  /* ─── 35 · Dry Mouth (Xerostomia) ─────────────────────────────────────── */
  {
    id: "dry-mouth",
    num: "35",
    ref: "PI-DRY-01",
    category: "groups",
    title: "Dry Mouth (Xerostomia)",
    summary: "Common causes, why it matters, and the daily routine that helps.",
    intro: "Saliva does more than people think — it washes the teeth clean, neutralises acid, helps food slide down, and keeps the soft tissues comfortable. When it dries up, decay accelerates, gums get sore, dentures stop fitting, and eating becomes hard work.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          { kind: "numbered", title: "The Common Causes", items: [
            { title: "Medications.", body: "Over 400 prescription drugs cause dry mouth. The big ones: blood-pressure tablets, antidepressants, antihistamines, water tablets (diuretics), painkillers and inhalers. The more you take, the drier it gets — most older patients have 4+ on the list." },
            { title: "Age.", body: "Saliva flow drops naturally with the years, mostly because of the medications above rather than the gland itself." },
            { title: "Radiotherapy to the head and neck.", body: "Often permanent. We plan around it." },
            { title: "Sjögren's syndrome & other conditions.", body: "Sjögren's, diabetes, kidney problems and thyroid disorders all dry the mouth out. Worth a GP visit if you can't pin down the cause." },
            { title: "Mouth-breathing & snoring.", body: "Sleeping with the mouth open dries the front teeth out overnight. A common cause of waking up parched." },
          ]},
          { kind: "prose", title: "Why It Matters", items: [
            { lead: "Decay accelerates.", body: "Without saliva, sugars sit on the teeth all day. Patients with dry mouths can develop multiple cavities in a single year — particularly at the gum line and on the roots." },
            { lead: "Gum disease and ulcers.", body: "The mouth feels constantly sore. Ulcers heal more slowly." },
            { lead: "Oral thrush.", body: "Saliva keeps thrush in check. White patches that wipe off, with a sore base, are common." },
            { lead: "Dentures stop fitting.", body: "Saliva is the glue that holds an upper denture in place. Without it, the denture moves around constantly." },
            { lead: "Difficulty eating, speaking, sleeping.", body: "Food sticks to the cheeks. Speech tires. Waking through the night for water." },
          ]},
        ],
        callout: { title: "Tell us — and tell your GP", body: "Most dry mouth is medication-related. Your GP may be able to switch one of the offenders for an alternative, or change the dose timing. We can't change your medications — but with that and the routine on page 2, most patients see real improvement within a few weeks." },
        notice: { title: "The quick test", body: "Run a finger gently along the inside of the cheek. In a healthy mouth it slides on a thin film of saliva. In a dry mouth, the finger drags. If we mention you have a dry mouth, that's usually what we've felt — and why decay risk is up." },
      },
      {
        eyebrow: "Daily Care",
        pageTitle: "Living With a Dry Mouth",
        intro: "Three things to do every day: protect the teeth, stimulate what saliva you have, and replace what you don't. None of them are difficult — but they need to be consistent.",
        sections: [
          { kind: "list", title: "Protecting the Teeth", items: [
            { title: "High-fluoride toothpaste on prescription.", tag: "TWICE A DAY", body: "2,800 or 5,000 ppm. Pea-sized, brush gently for two minutes, spit and don't rinse." },
            { title: "Fluoride mouthwash separately from brushing.", tag: "ONCE A DAY", body: "Used at a different time — brushing already gives you fluoride, the mouthwash adds another dose." },
            { title: "Hygienist visits every 3–4 months.", tag: "REGULARLY", body: "More often than usual — dry-mouth patients need closer monitoring." },
          ]},
          { kind: "list", title: "Stimulating What Saliva You Have", items: [
            { title: "Sugar-free gum or lozenges.", tag: "AFTER EVERY MEAL", body: "Look for xylitol on the ingredients. Stimulates saliva and helps against decay." },
            { title: "Sip water all day.", tag: "CONSTANTLY", body: "Small frequent sips. A water bottle by the bed for the night." },
            { title: "Saliva substitutes.", tag: "AS NEEDED", body: "Biotene gel, BioXtra, Oralieve, Saliva Orthana — sprays, gels and lozenges from any pharmacy. Apply before meals and at night." },
          ]},
          { kind: "compare", title: "Helps & Avoid",
            left:  { title: "Helps", items: [
              "Lip balm at night.",
              "A humidifier in the bedroom.",
              "Soft, moist foods — soups, casseroles, sauces with everything.",
              "Asking your GP whether any medications can be changed.",
            ]},
            right: { title: "Makes it worse", items: [
              "Alcohol-based mouthwashes — strip the mouth dry.",
              "Caffeine, alcohol, and smoking.",
              "Salty, spicy and acidic foods when sore.",
              "Sipping squash or sugary drinks for moisture — the worst possible combination.",
            ]},
          },
        ],
        noticeBox: { title: "Ring the practice if you notice:", items: [
          "White patches in the mouth that wipe off, leaving a red base (likely thrush).",
          "A burning tongue or sore inside cheeks.",
          "New cavities or sensitivity at the gum line.",
          "An ulcer that hasn't healed after two weeks.",
          "A denture that has stopped fitting comfortably.",
        ]},
      },
    ],
  },

  /* ─── 36 · Eating Disorders & the Mouth ───────────────────────────────── */
  {
    id: "eating-disorders",
    num: "36",
    ref: "PI-EDM-01",
    category: "groups",
    title: "Eating Disorders & the Mouth",
    summary: "What we see, what we can do, and where to find help.",
    intro: "The mouth often shows the signs of an eating disorder before anyone else does. We sometimes notice patterns of erosion, dry mouth or gum changes at routine check-ups. Whatever brings someone in, our job is to look after the teeth — without lecturing, and with as much support as is wanted.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          { kind: "numbered", title: "What Repeated Vomiting Does", items: [
            { title: "Acid erosion on the inside of the front teeth.", body: "Stomach acid is much stronger than anything in the diet. Repeated exposure thins the enamel on the inside of the upper front teeth, leaving them more see-through and brittle at the edges." },
            { title: "Sensitivity to cold and sweet.", body: "As enamel thins, the dentine underneath is exposed and reacts to cold drinks and sweet foods." },
            { title: "Cracks and chips at the edges.", body: "Eroded enamel becomes fragile. Front teeth start to look thin and uneven at the biting edges." },
            { title: "Dry mouth and salivary gland swelling.", body: "Some people notice a puffiness at the angle of the jaw — the salivary glands working overtime. Dry mouth in turn raises the risk of decay everywhere." },
          ]},
          { kind: "prose", title: "What Restrictive Eating Does", items: [
            { lead: "Sore, pale gums.", body: "Low iron, B12 and folate show up first as gum and tongue changes — a smooth red tongue is a classic sign." },
            { lead: "Slower healing.", body: "Mouth ulcers take longer to clear, gum infections recur more easily, soft tissue is fragile." },
            { lead: "Bone changes.", body: "Long-term restrictive eating can affect the bone supporting the teeth." },
            { lead: "Dry, cracked lips and angular cheilitis.", body: "Sore, scaling cracks at the corners of the mouth." },
          ]},
        ],
        callout: { title: "What we will and won't do", body: "We won't lecture, and nothing you tell us is shared without your permission. We can support what you're already doing for your teeth, fix what damage we can, and (when you'd like) write to your GP or another specialist. We'd rather see you at your own pace than not at all. Our Managing Dental Anxiety leaflet covers the practical things we offer to make appointments easier." },
        notice: { title: "If you're reading this for someone else", body: "The mouth is sometimes where the first sign appears, especially in teenagers and young adults. Bringing someone for a check-up is a reasonable, non-confrontational way to start a conversation. We will not raise it with them unprompted, but we will know what we're looking for. Our Teenagers leaflet covers the same ground gently." },
      },
      {
        eyebrow: "Self-Care",
        pageTitle: "Protecting the Teeth",
        intro: "Whatever stage of recovery you're at, the routine below limits further damage. None of it depends on changing what you eat first — it's about protecting the enamel that's there.",
        sections: [
          { kind: "list", title: "After Vomiting", items: [
            { title: "Don't brush straight away.", tag: "WAIT 30–60 MINS", body: "Acid leaves enamel briefly soft. Brushing then wears it away. The single most important rule." },
            { title: "Rinse with water.", tag: "IMMEDIATELY", body: "Plain water, or water with a teaspoon of baking soda dissolved in it. Neutralises the acid." },
            { title: "Sugar-free gum.", tag: "AFTERWARDS", body: "Stimulates saliva, which is the body's natural acid neutraliser." },
            { title: "Then brush gently when the mouth feels normal.", tag: "AFTER 30–60 MINS", body: "Soft brush, fluoride toothpaste, gentle pressure." },
          ]},
          { kind: "list", title: "Daily Routine", items: [
            { title: "High-fluoride toothpaste on prescription.", tag: "TWICE A DAY", body: "2,800 ppm. We can prescribe — works much harder than ordinary toothpaste at remineralising enamel." },
            { title: "Fluoride mouthwash separately.", tag: "ONCE A DAY", body: "At a different time from brushing — the mouth gets two doses of fluoride, not one." },
            { title: "Sip water steadily.", tag: "ALL DAY", body: "Counters dry mouth, helps saliva." },
            { title: "Hygienist visits every 3–4 months.", tag: "MORE OFTEN THAN USUAL", body: "Closer monitoring of erosion, fluoride varnish, gentle support." },
          ]},
        ],
        noticeBox: { title: "Talk to us — or your GP — if you notice:", items: [
          "Front teeth becoming see-through, chipped or shorter than they were.",
          "Sensitivity to cold and sweet that is getting worse.",
          "Persistent dry mouth or sore corners of the mouth.",
          "Anything you'd like help with — including a referral to a GP, eating-disorder service, or talking therapy. We can write a letter for you.",
          "Sources of help: Beat (UK eating-disorder charity), 0808 801 0677. NHS 111. Your GP.",
        ]},
      },
    ],
  },

  /* ─── 37 · Carers' Guide: Mouth Care ──────────────────────────────────── */
  {
    id: "carers-mouth-care",
    num: "37",
    ref: "PI-CRG-01",
    category: "groups",
    title: "Carers' Guide: Mouth Care",
    summary: "Position, brush, and the day-to-day routine for someone who can't do their own.",
    intro: "For someone who can't brush their own teeth — through dementia, stroke, frailty or disability — mouth care often falls behind everything else. It matters more, not less. A clean mouth means fewer infections, less pain, better appetite, and a much lower risk of pneumonia from inhaled bacteria.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          { kind: "numbered", title: "Setting Up", items: [
            { title: "Position.", body: "Sit them slightly upright, never lying flat. Stand or sit beside them, head supported. For someone in bed, raise the head of the bed and tilt their head a little towards you." },
            { title: "Light.", body: "You can't clean what you can't see. A torch on the phone, or a small clip-on light, makes everything easier." },
            { title: "The right brush.", body: "Soft or extra-soft, small head, ideally electric — does most of the work for you. A children's brush in an adult's mouth often fits better than an adult one." },
            { title: "The right toothpaste.", body: "Pea-sized amount of fluoride toothpaste. For someone who can't spit, a non-foaming toothpaste (Oranurse) is much easier — no minty taste, no foaming. Smear-amount only." },
            { title: "A bowl, towel and water.", body: "For rinsing the brush, dribbles, and to wet the brush before each section." },
          ]},
          { kind: "prose", title: "The Brushing Itself", items: [
            { lead: "Twice a day, two minutes.", body: "Morning and bedtime. The bedtime one matters most." },
            { lead: "Outside surfaces, then inside, then biting surfaces.", body: "Predictable order helps both of you. Small circles, gentle pressure, all the way to the back." },
            { lead: "Don't forget the inside of the lower fronts.", body: "The biggest tartar trap, easiest place to miss." },
            { lead: "Tongue and cheeks.", body: "A few gentle strokes — keeps the mouth fresher and reduces infection risk." },
            { lead: "Don't rinse afterwards.", body: "Wipe the mouth with a damp gauze square or face cloth instead. Lets the fluoride keep working." },
          ]},
        ],
        callout: { title: "If they resist", body: "Resistance is common, especially in dementia. Try a different time of day, when they are calmer. Keep your voice low and the words simple — \"open\", \"a clean\" — said the same way each time. A familiar song or favourite tune playing softly helps. If they bite down on the brush, wait calmly for the jaw to relax — never force the brush. We are happy to demonstrate; bring them in and we'll show you in person." },
        notice: { title: "The pneumonia connection", body: "People who can't clean their own mouths inhale tiny amounts of saliva and bacteria, particularly at night. A neglected mouth substantially raises the risk of chest infections and aspiration pneumonia. Mouth care for the very frail isn't cosmetic — it is genuinely life-saving in some cases." },
      },
      {
        eyebrow: "Daily Care",
        pageTitle: "Day-to-Day",
        intro: "A short, predictable routine works best. The first week or two is the hardest; after that it becomes part of the day.",
        sections: [
          { kind: "list", title: "Daily", items: [
            { title: "Brush teeth twice a day.", tag: "MORNING & BEDTIME", body: "Pea of fluoride toothpaste. Wipe excess foam away with a gauze square — they don't need to spit." },
            { title: "Sip water through the day.", tag: "AS ABLE", body: "A dry mouth is uncomfortable and accelerates decay. A bottle within reach, sips between meals." },
            { title: "Lip balm.", tag: "MORNING & NIGHT", body: "Plain Vaseline or a fragrance-free balm. Cracked lips are a quiet source of pain." },
            { title: "Look in the mouth once a day.", tag: "DURING BRUSHING", body: "White patches that wipe off (thrush), ulcers, broken teeth, sore spots from a denture." },
          ]},
          { kind: "list", title: "For Denture Wearers", items: [
            { title: "Take dentures out at night.", tag: "EVERY NIGHT", body: "Soak in water or a denture-cleansing tablet (Steradent). Gives the gums a rest and lowers thrush risk." },
            { title: "Brush the dentures.", tag: "TWICE A DAY", body: "Soft denture brush, plain soap, over a sink half-filled with water (so they don't shatter if dropped)." },
            { title: "Brush the gums and tongue.", tag: "TWICE A DAY", body: "Soft brush, no toothpaste needed. Keeps the mouth healthy underneath the denture." },
            { title: "Mark the denture with their name.", tag: "ONCE", body: "Particularly in care homes — we can do this when we see them." },
          ]},
        ],
        noticeBox: { title: "Ring the practice if you notice:", items: [
          "Pain when eating, refusing food, or holding one side of the face.",
          "Bleeding gums, especially when not brushing.",
          "White patches that wipe off, leaving a sore red base (oral thrush).",
          "An ulcer that hasn't healed after two weeks.",
          "A broken tooth or a denture that has stopped fitting.",
          "You'd like a home or care-home visit — we can sometimes arrange this.",
        ]},
      },
    ],
  },

  /* ─── 38 · Your First Visit ───────────────────────────────────────────── */
  {
    id: "first-visit",
    num: "38",
    ref: "PI-NPV-01",
    category: "practical",
    title: "Your First Visit",
    summary: "What happens, what to bring, and what to expect afterwards.",
    intro: "A new-patient appointment is longer than a routine check-up — usually around 45 minutes — because we're meeting your mouth properly for the first time. Most of it is conversation and gentle examination. No injections, no drilling.",
    pages: [
      {
        eyebrow: "New Patients",
        sections: [
          { kind: "numbered", title: "What Happens", items: [
            { title: "A chat first.", body: "How you feel about the dentist, what brings you in, anything that has been worrying you, what you'd like from us in the long run. We'd rather know early what matters most." },
            { title: "Medical history.", body: "Conditions, medications, allergies, anything from your GP. This shapes how we plan everything else, and we'll ask you to update it at every visit." },
            { title: "The examination.", body: "Teeth, fillings, gums, tongue, cheeks, palate, jaw joint, neck and lymph nodes. We screen for oral cancer at every check-up — see our Oral Cancer Awareness leaflet." },
            { title: "X-rays, usually.", body: "Two small bitewing X-rays show decay between the teeth that we can't see by looking. We follow strict guidelines on dose and frequency — see our X-Rays leaflet for the numbers." },
            { title: "Photographs.", body: "For your record, with your permission. Useful to track changes over the years." },
            { title: "The plan.", body: "We talk through what we've found, in plain English. You'll leave with a written treatment plan, costs and timing — nothing gets booked or paid for without you understanding it first." },
          ]},
          { kind: "prose", title: "What to Bring", items: [
            { lead: "Your medication list.", body: "Repeat-prescription slip from your GP, or a screenshot from the NHS App." },
            { lead: "Records from a previous dentist if you have them.", body: "Particularly any recent X-rays or treatment notes — saves you a repeat." },
            { lead: "Glasses, hearing aids, dentures.", body: "Anything you usually wear. Bring spare denture cases for soaking." },
            { lead: "Names of any specialists.", body: "Cardiologist, oncologist, endocrinologist — anyone we may need to write to." },
          ]},
        ],
        callout: { title: "If you're anxious", body: "Tell us at the desk before you sit down. There is no judgement — about a third of adults find the dentist difficult. The first appointment is mostly chat and examination, and we go entirely at your pace. See our Managing Dental Anxiety leaflet, which lists everything we offer to make visits easier." },
        notice: { title: "It's been a while?", body: "That's okay. Most patients we see for the first time haven't been to a dentist for years, sometimes decades. We don't lecture, and we don't rush. The aim of the first visit is a clear picture and a sensible plan — not to fix everything at once." },
      },
      {
        eyebrow: "Practical",
        pageTitle: "What Happens Next",
        intro: "Once we've seen you, you'll usually leave with a written plan. Here's what to expect from it, and how the rest of your time with us tends to go.",
        sections: [
          { kind: "list", title: "Your Treatment Plan", items: [
            { title: "Itemised in writing.", tag: "DAY OF VISIT", body: "Each item with a price next to it, marked NHS or private where you have a choice. Nothing booked until you've agreed." },
            { title: "Ordered by priority.", tag: "ALWAYS", body: "Pain or infection first, then prevention (hygienist, sealants, fluoride), then anything cosmetic. Plans can be spread out — you do not have to do it all at once." },
            { title: "Options for the bigger items.", tag: "WHEN RELEVANT", body: "For crowns, implants, veneers and dentures we'll usually offer 2–3 options at different price points and explain the trade-offs." },
            { title: "You take it away to think about.", tag: "ALWAYS WELCOME", body: "Feel free to come back with questions, by phone or email, before booking anything." },
          ]},
          { kind: "compare", title: "The Rhythm of Routine Care",
            left:  { title: "What to expect", items: [
              "Check-ups every 6 months for most adults — sometimes 9 or 12 if everything is settled.",
              "Hygienist every 6 months as standard, more often for some.",
              "X-rays every 1–3 years, depending on decay risk.",
              "Reminders by text or email — let us know how you prefer to hear from us.",
            ]},
            right: { title: "You're in charge of", items: [
              "What treatment to have, and when.",
              "Asking for a second opinion any time you want one.",
              "Bringing a friend or family member to any appointment.",
              "Stopping treatment at any point if you want a break.",
            ]},
          },
        ],
        noticeBox: { title: "Ring the practice if:", items: [
          "Anything in the plan didn't make sense — we'd rather explain again than have you leave puzzled.",
          "Your circumstances change (medications, a new diagnosis, a hospital stay).",
          "Something in your mouth has changed since we saw you.",
          "You want to bring someone in for the next visit.",
        ]},
      },
    ],
  },

  /* ─── 39 · NHS vs Private Care ────────────────────────────────────────── */
  {
    id: "nhs-vs-private",
    num: "39",
    ref: "PI-NHP-01",
    category: "practical",
    title: "NHS vs Private Care",
    summary: "What each covers, side-by-side — and how to mix them sensibly.",
    intro: "Most patients ask the same question early on: what's the difference between NHS and private at this practice, and which one do I need? The honest answer is that NHS care covers everything you clinically need to keep your mouth healthy. Private care covers everything else — choice, time and materials beyond what the NHS will fund.",
    pages: [
      {
        eyebrow: "Practice Information",
        sections: [
          { kind: "numbered", title: "What NHS Dentistry Covers", items: [
            { title: "Band 1 — £27.40.", body: "Examination, X-rays, scale and polish if clinically needed, advice on prevention. Also covers urgent appointments for emergencies." },
            { title: "Band 2 — £75.30.", body: "Everything in Band 1, plus fillings, root canal treatment, extractions, and treatment for gum disease." },
            { title: "Band 3 — £326.70.", body: "Everything in Bands 1 and 2, plus crowns, dentures, bridges, and other complex laboratory work." },
            { title: "Free for some patients.", body: "Children under 18, full-time students under 19, pregnant women and women who've had a baby in the last 12 months, and those on certain benefits (Universal Credit, Income Support, Pension Credit Guarantee). Bring proof." },
            { title: "Charges from April 2025.", body: "NHS charges are set by the government and change in April each year. We'll tell you the current band before any treatment starts." },
          ]},
          { kind: "prose", title: "What the NHS Doesn't Cover", items: [
            { lead: "Cosmetic treatment.", body: "Tooth whitening, veneers for appearance, white fillings on back teeth where amalgam would be funded, gum reshaping." },
            { lead: "Implants.", body: "Only available on the NHS in very specific medical circumstances (e.g. after cancer treatment), through hospital. Not routinely available." },
            { lead: "Premium materials.", body: "Tooth-coloured crowns on back teeth where the NHS specifies a metal one; high-end denture systems; certain ceramic options." },
            { lead: "Longer appointments and complex aesthetics.", body: "Smile design, full-mouth rehabilitation, intricate cosmetic work that needs more chair time than the NHS contract allows." },
            { lead: "Routine sedation for anxious patients.", body: "Available on the NHS in some areas but limited; private sedation is more easily arranged." },
          ]},
        ],
        callout: { title: "You can mix the two", body: "Many patients are NHS for routine examinations, scale-and-polish and fillings, and choose private for one specific thing — a whitening course, an implant to replace a missing tooth, a tooth-coloured crown on a back tooth. We'll always tell you in advance which parts are NHS, which are private, and what each costs." },
        notice: { title: "Don't lose your NHS place", body: "NHS dentistry is under pressure across the country. If you're an NHS patient with us, attending your check-ups keeps you registered. Long gaps without contact may mean we have to remove you from our NHS list." },
      },
      {
        eyebrow: "Choosing Your Care",
        pageTitle: "Side by Side",
        intro: "Both options are delivered by the same dentists, in the same surgery, to the same clinical standards. The differences are in time, choice, and materials — not quality of care.",
        sections: [
          { kind: "list", title: "What You Get", items: [
            { title: "Examination & X-rays.", tag: "BOTH", body: "NHS: Band 1 charge. Private: usually a longer appointment, more time for questions, sometimes a higher-resolution scan." },
            { title: "Hygienist visits.", tag: "BOTH", body: "NHS: scale and polish if clinically needed, included in Band 1 or 2. Private: longer appointments, regular maintenance, options like Airflow stain removal." },
            { title: "Fillings.", tag: "BOTH", body: "NHS: amalgam (silver) on back teeth, white on front teeth and visible surfaces. Private: tooth-coloured composite or porcelain inlays anywhere in the mouth." },
            { title: "Crowns.", tag: "BOTH", body: "NHS: metal-based (gold or PFM) on back teeth, white on front teeth. Private: choice of all-ceramic, e.max, zirconia for any tooth." },
            { title: "Replacing missing teeth.", tag: "BOTH", body: "NHS: dentures, conventional bridges. Private: implants, adhesive bridges, premium dentures (Valplast, cobalt-chrome)." },
            { title: "Whitening & smile design.", tag: "PRIVATE ONLY", body: "Not available on the NHS. Custom trays, in-chair whitening, veneers, composite bonding." },
          ]},
          { kind: "compare", title: "Helps to Know",
            left:  { title: "NHS care suits you if…", items: [
              "You want straightforward, clinically necessary care at a fixed price.",
              "You qualify for free NHS dental care.",
              "You don't mind metal fillings or crowns on back teeth.",
              "You aren't looking for cosmetic work.",
            ]},
            right: { title: "Private suits you if…", items: [
              "You want tooth-coloured work everywhere in the mouth.",
              "You're looking at implants, whitening or smile design.",
              "You'd like longer appointments, weekend or evening slots.",
              "You want to spread the cost through a dental plan.",
            ]},
          },
        ],
        noticeBox: { title: "Reception can help with:", items: [
          "Confirming the current NHS band charge for your treatment.",
          "Showing you a written estimate, NHS or private, before any treatment starts.",
          "Information on dental plans and finance for larger private treatment.",
          "Whether you qualify for free NHS dental care, and what proof to bring.",
          "Mixing NHS and private care across different treatments.",
        ]},
      },
    ],
  },

  /* ─── 40 · Dental X-Rays Explained ────────────────────────────────────── */
  {
    id: "dental-xrays",
    num: "40",
    ref: "PI-XRY-01",
    category: "practical",
    title: "Dental X-Rays Explained",
    summary: "The three kinds, the dose in plain terms, and how often.",
    intro: "X-rays show us what we can't see by looking — decay between the teeth, infection at the root, bone level around the gums, and unerupted teeth. The dose is small, but it isn't nothing, so we use them only when they will change what we do.",
    pages: [
      {
        eyebrow: "Patient Information",
        sections: [
          { kind: "numbered", title: "The Three Kinds We Take", items: [
            { title: "Bitewings.", body: "The everyday check-up X-ray. Two small pictures, one on each side, showing the back teeth. Catches decay between the teeth before it's big enough to need a crown. Usually every 1–3 years." },
            { title: "Periapical.", body: "A close-up of one tooth and its root. Used for toothache, before extractions, root canal treatment, and to investigate trauma." },
            { title: "Panoramic (OPG).", body: "One large picture showing the whole upper and lower jaw. Used for wisdom-teeth assessment, orthodontic planning, implant planning, or investigating jaw problems." },
          ]},
          { kind: "prose", title: "The Dose, in Plain Terms", intro: "We all receive natural background radiation every day from the soil, the air, food and cosmic rays — roughly 2.7 millisieverts a year in the UK. Dental X-rays are tiny in comparison. Putting them in everyday units:", items: [
            { lead: "A bitewing X-ray.", body: "About the same as one day of normal background radiation. Roughly the same dose as a 1-hour flight." },
            { lead: "A periapical X-ray.", body: "Similar — a couple of days of background." },
            { lead: "A panoramic X-ray.", body: "Around five to seven days of background. Roughly a return flight from London to New York." },
            { lead: "A medical chest X-ray.", body: "For comparison: about ten times a panoramic." },
          ]},
          { kind: "prose", title: "Why We Take Them at All", items: [
            { lead: "", body: "Decay between two teeth that are touching is impossible to see directly until it breaks through to the surface — by which point it is usually deep, sometimes into the nerve. Catching it on a bitewing while it's still small means a small filling, not a crown or a root canal. The same logic applies to gum disease, where the bone loss is hidden under the gum until we look at it on a film." },
          ]},
        ],
        callout: { title: "How often", body: "For an adult with healthy teeth and no recent decay, every 2–3 years is usually enough. For someone with a history of decay or active gum disease, every year or even every six months. We follow national guidelines and tailor it to your risk — we will tell you the rationale before we take any film." },
        notice: { title: "Pregnancy", body: "Routine dental X-rays during pregnancy are safe — the dose is tiny, the beam is aimed at the jaw, and a lead apron is used. We will still postpone them where we sensibly can, particularly in the first trimester. If you are or might be pregnant, please tell us." },
      },
      {
        eyebrow: "In Practice",
        pageTitle: "What to Expect",
        intro: "Taking an X-ray is quick and painless. The most fiddly part is sometimes positioning the small film holder; everything else is on the machine.",
        sections: [
          { kind: "list", title: "How It Goes", items: [
            { title: "A small holder in your mouth.", tag: "BITEWINGS & PERIAPICALS", body: "Gently bite on a plastic holder for 5–10 seconds. Some people gag — tell us, there are tricks that help." },
            { title: "You stand still while the machine moves.", tag: "PANORAMIC", body: "You bite on a small peg, the machine rotates around your head for about 15 seconds." },
            { title: "Lead apron and thyroid collar.", tag: "WHERE APPROPRIATE", body: "Belt-and-braces with an already-tiny dose. Always available if you'd like one." },
            { title: "You see the image straight away.", tag: "SAME VISIT", body: "Digital sensors show the result on the screen within seconds. We'll talk you through what we're seeing." },
          ]},
          { kind: "compare", title: "Helpful to Know",
            left:  { title: "Worth asking", items: [
              "Bring any X-rays from a previous dentist — saves you a repeat.",
              "Ask to see the images — most patients find them interesting and they make explanations clearer.",
              "Tell us if you've had medical CT scans recently — affects cumulative dose decisions.",
              "Ask why we're taking one if it isn't obvious.",
            ]},
            right: { title: "Common worries", items: [
              "\"Can I refuse?\" — yes, always. Sometimes treatment can't go ahead safely without one. We'll explain.",
              "\"Is it safe with a pacemaker?\" — yes. Dental X-rays don't affect them.",
              "\"Is the dose adding up over a lifetime?\" — barely. Decades of dental X-rays still add to less than one CT scan.",
              "\"Can I take a copy?\" — yes, on a USB or by email.",
            ]},
          },
        ],
        noticeBox: { title: "Tell us before any X-ray if:", items: [
          "You are pregnant or might be.",
          "You have had recent medical X-rays or CT scans for another reason.",
          "You gag easily — there are smaller sensors and different positions we can try.",
          "You have a strong preference not to have one — we'll talk through the alternatives.",
        ]},
      },
    ],
  },

  /* ─── 41 · Looking After a New Filling or Crown ───────────────────────── */
  {
    id: "new-filling-crown",
    num: "41",
    ref: "PI-NFC-01",
    category: "practical",
    title: "Looking After a New Filling or Crown",
    summary: "What's normal, what isn't, and the few things that make it last.",
    intro: "You've just had a filling or a crown. The first 24–48 hours feel slightly odd — the bite, the temperature, the gum. Here's what's normal, what isn't, and the few things that make it last.",
    pages: [
      {
        eyebrow: "Restorative",
        sections: [
          { kind: "numbered", title: "Right After Your Appointment", items: [
            { title: "While the numbness is wearing off.", body: "Usually 2–4 hours. Don't eat anything hot or chewy until full feeling is back — it's easy to bite the inside of your lip or cheek without realising. Stick to drinks for now." },
            { title: "Temporary crowns.", body: "If we've fitted a temporary while the lab makes the final crown, avoid sticky food (chewing gum, toffees) and chew on the other side. Floss it gently — pull through to the side rather than lift up, so you don't catch the edge." },
            { title: "White (composite) fillings.", body: "Set fully under the curing light — you can eat as soon as the numbness has worn off. The tooth may be a little sensitive to cold for a few days." },
            { title: "Silver (amalgam) fillings.", body: "Take 24 hours to harden completely. Eat soft foods that day, brush gently around the area at night." },
          ]},
          { kind: "prose", title: "What's Normal in the First Week", items: [
            { lead: "Mild sensitivity to cold or sweet.", body: "Common with deeper fillings and crowns. Settles over 1–4 weeks. Sensitive-teeth toothpaste (Sensodyne, Colgate Sensitive) helps." },
            { lead: "A slightly \"high\" bite.", body: "The local anaesthetic makes it hard to bite normally during the appointment. If, a day later, the new restoration still feels like the first thing your teeth meet on, ring us — a 2-minute adjustment fixes it." },
            { lead: "Tender gum next to the tooth.", body: "From the rubber dam, the matrix band, or the local injection. Eases off in 2–3 days." },
            { lead: "A sharp edge to the tongue.", body: "The polish may settle into a slightly sharper feel after a day. We'll smooth it at no charge — just call." },
          ]},
        ],
        callout: { title: "What isn't normal", body: "Throbbing pain that wakes you at night, pain that lingers for more than 30 seconds after a sip of cold or hot, or pain that gets worse rather than better after the first week. These are signs the nerve is unhappy. The earlier we look, the more options we have." },
        notice: { title: "If a temporary crown comes off", body: "It happens occasionally. Don't panic. Keep the crown safe, brush the tooth underneath gently, and ring us — we'll re-cement it. Don't leave the tooth uncovered for long; the prepared shape is fragile and can shift if exposed." },
      },
      {
        eyebrow: "Making It Last",
        pageTitle: "Helping It Last",
        intro: "A filling or crown isn't a one-and-done. The tooth around it can still decay, and the gum line is where most failures begin. The points below are what genuinely makes the difference between a 5-year and a 20-year restoration.",
        sections: [
          { kind: "list", title: "Daily", items: [
            { title: "Brush twice a day, two minutes.", tag: "ESPECIALLY THE GUM LINE", body: "Soft electric brush angled at the gum margin. Decay around an old filling almost always starts here." },
            { title: "Clean between every day.", tag: "ONCE DAILY", body: "Floss or interdental brush — between every tooth, including either side of the new one. The contact point is the second commonest decay site." },
            { title: "Spit, don't rinse.", tag: "AFTER BRUSHING", body: "Leaves a thin layer of fluoride toothpaste on the teeth overnight. Reduces new decay around restorations." },
          ]},
          { kind: "compare", title: "Helps & Hinders",
            left:  { title: "Helps it last", items: [
              "Sugar at mealtimes only — not grazed through the day.",
              "A high-fluoride toothpaste if we've advised one.",
              "A night-guard if we've told you you're a grinder.",
              "Routine check-ups so we catch any wear early.",
            ]},
            right: { title: "Shortens its life", items: [
              "Chewing ice, hard sweets, pen tops, fingernails.",
              "Cracking nuts or shellfish with your teeth.",
              "Tooth grinding without protection (it cracks crowns).",
              "Stopping interdental cleaning because it bleeds.",
            ]},
          },
        ],
        noticeBox: { title: "Ring the practice if you notice:", items: [
          "Bite still feels high more than 24 hours after the appointment.",
          "Sharp edge that catches the tongue or floss.",
          "Pain that lingers more than 30 seconds after hot or cold.",
          "Throbbing pain at night, or pain on biting that gets worse over a week.",
          "The crown or filling has come off entirely.",
          "The gum next to the new restoration is still sore after 7–10 days.",
        ]},
      },
    ],
  },

  /* ─── 42 · Travelling with Dental Problems ────────────────────────────── */
  {
    id: "travelling",
    num: "42",
    ref: "PI-TRV-01",
    category: "practical",
    title: "Travelling with Dental Problems",
    summary: "Before you go, while you're away, and what insurance actually covers.",
    intro: "Toothache always seems to find you on holiday. A 30-minute appointment before you fly is often the difference between a good trip and a ruined one. This leaflet covers what to do before you go, what travel insurance actually covers, and what to do if something happens while you're away.",
    pages: [
      {
        eyebrow: "Practice Information",
        sections: [
          { kind: "numbered", title: "Before You Travel", items: [
            { title: "Book a check-up 4–6 weeks before a long trip.", body: "Long enough to fix anything we find. Cracked fillings, the tooth that's \"twinged a couple of times\", a wisdom tooth that's been niggling — far cheaper to handle here than abroad." },
            { title: "Don't fly within a week of major work.", body: "Especially extractions, root canals, sinus lifts. Cabin pressure changes can cause pain (\"barotrauma\") in any tooth with active inflammation or a recent surgical site." },
            { title: "Pack a small dental kit.", body: "Travel-size toothpaste and brush, floss, a small bottle of mouthwash, paracetamol and ibuprofen, dental wax (for braces or sharp edges), and temporary filling material from a pharmacy (Dentanurse). Sugar-free gum settles ear pressure and helps a dry mouth on flights." },
            { title: "Check your travel insurance.", body: "Most policies cover emergency dental pain relief — temporary fillings, antibiotics, an extraction if needed. They very rarely cover definitive work (new crowns, implants, root canals to completion). Bring receipts back; we can finish the work here." },
          ]},
          { kind: "prose", title: "Common Problems on Holiday", items: [
            { lead: "Tooth pain on the plane.", body: "Almost always a tooth that was already inflamed. Pain relief, sugar-free gum, and ring us when you land if it doesn't settle in 24 hours." },
            { lead: "A filling falls out.", body: "Rinse the tooth, fill the cavity with the temporary material from your kit (or sugar-free gum, in a pinch). Keep clean. Have it properly replaced when you're home." },
            { lead: "A crown comes off.", body: "Keep it. If clean, you can press it back into place — denture fixative or temporary cement (Recapit) holds it for a few days. Don't use superglue. We'll re-cement it on your return." },
            { lead: "Knocked-out tooth.", body: "True emergency. Find a local dentist or hospital A&E within an hour. Hold the tooth by the crown only; if you can put it back in the socket, do; otherwise milk, saliva or saline. Don't scrub it." },
            { lead: "Facial swelling.", body: "Don't wait. A spreading infection is the one dental problem that genuinely needs same-day care anywhere in the world." },
          ]},
        ],
        callout: { title: "About \"dental tourism\"", body: "Treatment abroad can look attractive on price. Be cautious. We see the failures — implants placed where there wasn't enough bone, crowns prepared too aggressively, work done in a single week that should have taken three months. If something goes wrong six months later, you're back in the UK and the original clinic is across a border. We can't always rescue it, and we're rarely able to honour another clinic's guarantee. Worth a frank conversation before you book." },
        notice: { title: "EHIC and GHIC cards", body: "The Global Health Insurance Card (GHIC) covers emergency state-provided dental care across the EU at the same rate locals pay. It is not a substitute for travel insurance. Many private clinics abroad don't accept it — a separate insurance policy is what actually covers private emergency dental." },
      },
      {
        eyebrow: "Practical Tips",
        pageTitle: "While You're Away",
        intro: "If something does go wrong, these are the steps that have worked best for our patients. Most situations can be held until you're home.",
        sections: [
          { kind: "list", title: "Holding Things Together", items: [
            { title: "Pain relief that works.", tag: "FIRST STEP", body: "Ibuprofen 400 mg + paracetamol 1 g taken together (if you can take both) covers most dental pain. Repeat at the usual intervals. Don't take more than the daily limit on either." },
            { title: "Salt-water rinses.", tag: "3–4× A DAY", body: "Half-teaspoon of salt in warm water. Helps a sore gum, an irritated extraction site, or a wisdom tooth flare-up." },
            { title: "Cold pack on the cheek.", tag: "FIRST 24 HOURS", body: "Wrap a hotel ice pack in a thin towel. 20 minutes on, 20 off. Reduces swelling and pain together." },
            { title: "Avoid the trigger.", tag: "UNTIL YOU'RE HOME", body: "Cold, hot, sweet, chewing on the bad side. Soft foods, lukewarm drinks, the other side of the mouth." },
          ]},
          { kind: "compare", title: "When to See a Dentist Abroad",
            left:  { title: "Same day", items: [
              "Facial swelling, fever, or difficulty swallowing.",
              "Severe pain not controlled by ibuprofen + paracetamol.",
              "An adult tooth knocked out or pushed up into the gum.",
              "Bleeding from the mouth that won't stop with firm pressure.",
            ]},
            right: { title: "Hold until you're home", items: [
              "Lost crown, with no pain.",
              "Lost filling, with no pain.",
              "A small chip with no sensitivity.",
              "Mild gum soreness that responds to salt-water rinses.",
            ]},
          },
        ],
        noticeBox: { title: "Ring the practice when you're back if:", items: [
          "You had any treatment abroad — bring receipts and any X-rays they gave you.",
          "You held something with temporary material — we'll book you in to do it properly.",
          "You took antibiotics for a dental infection — the underlying tooth still needs treating.",
          "You had any pain on the plane — even if it's settled, we should look at the tooth.",
          "You're planning another long trip — we'll do a pre-travel check.",
        ]},
      },
    ],
  },

  /* ─── 43 · Dental Emergencies ─────────────────────────────────────────── */
  {
    id: "dental-emergencies",
    num: "43",
    ref: "PI-EMG-01",
    category: "other",
    title: "Dental Emergencies — What to Do",
    summary: "Knocked-out teeth, chips, abscess pain — and when A&E is the right call.",
    intro: "When a dental emergency happens, what you do in the first few minutes really matters. With a knocked-out tooth in particular, acting quickly can be the difference between saving it and losing it. If you are not sure whether to call us, please do — it is always better to ask.",
    pages: [
      {
        eyebrow: "Emergency Care",
        sections: [
          { kind: "numbered", title: "Knocked-Out (Avulsed) Adult Tooth", intro: "A knocked-out adult tooth is one of the few true dental emergencies where every minute counts. Aim to see us within 30–60 minutes for the best chance of successful replantation.", items: [
            { title: "Hold the tooth by the crown only.", body: "Pick it up by the white chewing surface — never touch the root. The delicate cells on the root surface are what allow the tooth to reattach." },
            { title: "If it's dirty, rinse briefly in milk.", body: "Hold under cool milk for a few seconds — do not scrub, dry, or wrap in tissue. Avoid plain water; it damages the root cells." },
            { title: "Try to put it back in the socket.", body: "Gently push the tooth into place the right way round and bite softly on a clean cloth or gauze to hold it. This gives the best chance of saving the tooth." },
            { title: "If you can't — keep it moist.", body: "Store the tooth in a small container of milk, or tuck it inside the cheek of an adult who is awake. Bring it with you straight away." },
          ]},
          { kind: "prose", title: "Broken, Cracked, or Chipped Tooth", items: [
            { lead: "Rinse and save the pieces.", body: "Rinse your mouth with warm water to clean the area and save any tooth fragments in a small container of milk — we may be able to bond them back on." },
            { lead: "Cold compress for swelling.", body: "Apply a cold pack or ice wrapped in a cloth to the outside of the cheek for 10 minutes on, 10 minutes off, to reduce inflammation and pain." },
            { lead: "Cover sharp edges.", body: "If a jagged edge is cutting your tongue or cheek, cover it with a small piece of sugar-free chewing gum or dental wax until you can see us." },
            { lead: "Pain relief.", body: "Paracetamol or ibuprofen at the recommended dose works well — don't put aspirin directly on the gum." },
          ]},
          { kind: "prose", title: "Severe Toothache or Abscess", items: [
            { lead: "Floss gently.", body: "Carefully floss around the painful tooth to make sure no trapped food is causing pressure." },
            { lead: "Warm salt-water rinses.", body: "A teaspoon of salt in a cup of warm water, swilled and spat several times a day, helps soothe inflamed gums and draws out infection." },
            { lead: "Avoid heat.", body: "Do not place heat packs against the cheek or aspirin directly on the gum — both can burn tissues and worsen an abscess." },
            { lead: "Call us promptly.", body: "An abscess will not resolve on its own. Pain that wakes you at night, throbbing that won't settle, or a swelling on the gum or face all need same-day care." },
          ]},
        ],
        callout: { title: "If you are not sure, call", body: "Most dental problems become harder and more expensive to treat the longer they are left. If you are unsure whether what you have is an emergency, please call — we'd rather hear from you and reassure you than have a small problem grow overnight." },
        notice: { title: "Adult tooth knocked out?", body: "Hold it by the crown, pop it back in the socket if you can, or store it in milk — then call us straight away. The sooner we see you, the better the result." },
      },
      {
        eyebrow: "When to Go Where",
        pageTitle: "When to Call Us, When to Go to A&E",
        intro: "Most dental problems are best dealt with by your dental team. A small number need a hospital emergency department instead. Use this page to know which is which — and to keep a small \"grab kit\" ready at home, just in case.",
        sections: [
          { kind: "list", title: "Go Straight to A&E If You Have:", items: [
            { title: "Difficulty breathing or swallowing.", tag: "999 / A&E", body: "This can mean a severe infection is affecting the airway. Do not wait — call 999 or go straight to A&E." },
            { title: "Severe facial swelling.", tag: "A&E", body: "Rapidly spreading swelling that reaches the eye or down the neck, especially with fever or feeling unwell, needs hospital review." },
            { title: "Suspected jaw fracture.", tag: "A&E", body: "After a heavy blow to the face, if you cannot open or close your mouth properly, your bite feels misaligned, or there is numbness in the lip or chin." },
            { title: "Bleeding that won't stop.", tag: "A&E", body: "Bleeding from the mouth that doesn't slow after 15 minutes of firm pressure with a clean gauze or cloth." },
            { title: "Significant head injury.", tag: "A&E", body: "If the dental injury came with loss of consciousness, vomiting, confusion, or a possible broken bone, the head injury takes priority." },
          ]},
          { kind: "compare", title: "In an Emergency: Do & Avoid",
            left:  { title: "Do", items: [
              "Call the Practice as soon as possible — we keep emergency slots free each day.",
              "Save any tooth or fragment in milk and bring it with you.",
              "Use cold compresses for swelling and over-the-counter pain relief at the recommended dose.",
              "Use warm salt-water rinses for sore gums and after extractions.",
              "Note when symptoms started — it helps us decide what to do.",
            ]},
            right: { title: "Avoid", items: [
              "Touching the root of a knocked-out tooth, scrubbing it, or wrapping it in tissue.",
              "Storing a knocked-out tooth in plain tap water — it damages root cells.",
              "Placing aspirin directly on the gum or tooth — it causes chemical burns.",
              "Applying heat to a swollen face — it can spread infection.",
              "Hoping it will settle overnight — most dental emergencies worsen with time.",
            ]},
          },
          { kind: "list", title: "Your Home Emergency Kit", items: [
            { title: "Small clean container with a lid.", tag: "FOR A TOOTH", body: "For transporting a knocked-out tooth or fragments in milk." },
            { title: "Sterile gauze and a clean handkerchief.", tag: "FOR BLEEDING", body: "For applying firm pressure on bleeding sockets or wounds." },
            { title: "Dental wax or sugar-free chewing gum.", tag: "FOR SHARP EDGES", body: "To cover a jagged tooth or a broken brace wire and protect the tongue and cheek." },
            { title: "Paracetamol and ibuprofen.", tag: "FOR PAIN", body: "Used together at recommended doses, they're effective for most dental pain." },
            { title: "Our number saved in your phone & on the fridge.", tag: "ALWAYS" },
          ]},
        ],
        noticeBox: { title: "How to reach us:", items: [
          "During practice hours: call the main number — we will fit you in the same day.",
          "Out of hours: follow the instructions on the practice voicemail for our emergency on-call service.",
          "NHS 111: for urgent dental advice when the practice is closed.",
          "Life-threatening emergencies (airway, heavy bleeding, head injury): call 999 or go to A&E.",
        ]},
      },
    ],
  },

  /* ─── 44 · Managing Dental Anxiety ────────────────────────────────────── */
  {
    id: "dental-anxiety",
    num: "44",
    ref: "PI-PC-01",
    category: "other",
    title: "Managing Dental Anxiety",
    summary: "How we help, what you can do, and your calm-visit toolkit.",
    intro: "Feeling nervous about the dentist is more common than people think. Around one in three adults in the UK puts off appointments because of it. If that is you, please tell us when you book; we can do a lot to make the visit easier.",
    pages: [
      {
        eyebrow: "Patient Care",
        sections: [
          { kind: "numbered", title: "How We Help You Feel at Ease", items: [
            { title: "A Gentle Pace.", body: "We never rush. We will explain every step of your treatment beforehand so there are no surprises." },
            { title: "Stop Signals.", body: "You are in control. If you need a break at any time during a procedure, simply raise your hand and we will stop immediately." },
            { title: "Modern Anaesthesia.", body: "We use advanced numbing techniques to ensure you don't feel pain. For many, the fear of pain is the biggest hurdle — we make comfort our priority." },
          ]},
          { kind: "prose", title: "Tips for Your Visit", items: [
            { lead: "Talk to us.", body: "Please tell us if you are feeling anxious. Knowing your specific concerns helps us tailor our approach to your needs." },
            { lead: "Distractions.", body: "Feel free to bring noise-cancelling headphones and your favourite music or podcast to listen to during your appointment." },
            { lead: "Breathing techniques.", body: "Practice slow, deep belly breathing while in the chair to help lower your heart rate and relax your muscles." },
            { lead: "Bring a friend.", body: "If it makes you feel more secure, you are welcome to bring a friend or family member for support during your consultation." },
          ]},
          { kind: "prose", title: "Why Regular Visits Matter", items: [
            { lead: "", body: "Putting off appointments tends to turn small problems into bigger ones. Coming in for regular check-ups, even short ones, lets us spot early issues while they are still quick and straightforward to treat." },
          ]},
        ],
        callout: { title: "You are in charge of the pace", body: "This is your appointment. If you need to stop, take a break, or just talk something through, please say so. We would much rather slow down than push on with someone who is not comfortable." },
        notice: { title: "Before you arrive", body: "If your anxiety feels severe, please call us ahead of your appointment. We can discuss extra options — such as a longer slot, a pre-visit walk-through, or sedation — before you arrive." },
      },
      {
        eyebrow: "Self-Help Toolkit",
        pageTitle: "Your Calm Visit Toolkit",
        intro: "Small steps, before and during your appointment, can make a real difference. Use this page to plan ahead — and to remind yourself that you are in control of the pace.",
        sections: [
          { kind: "list", title: "Before Your Visit", items: [
            { title: "Tell us you're anxious when booking.", tag: "AT BOOKING", body: "We can allow extra time and brief the clinical team so the visit feels unhurried." },
            { title: "Eat a light meal an hour before.", tag: "1 HR BEFORE", body: "Low blood sugar can make anxiety worse. Avoid caffeine — it amplifies a racing heart." },
            { title: "Pack headphones and a playlist or podcast.", tag: "DAY OF VISIT" },
            { title: "Arrive 5–10 minutes early.", tag: "DAY OF VISIT", body: "A few quiet minutes in reception lets your breathing settle before you go in." },
            { title: "Bring a friend or family member if it helps.", tag: "OPTIONAL" },
          ]},
          { kind: "compare", title: "In the Chair: Do & Avoid",
            left:  { title: "Do", items: [
              "Agree a stop signal — raised hand — with the clinician up front.",
              "Use slow belly breathing: 4 in, 6 out, through the nose.",
              "Ask us to talk you through what we're doing, step by step.",
              "Take short breaks whenever you need them.",
            ]},
            right: { title: "Avoid", items: [
              "Holding your breath — it raises your heart rate and tension.",
              "Caffeine or energy drinks before your appointment.",
              "Reading worst-case stories online the night before.",
              "Pushing through if you feel overwhelmed — just signal us.",
            ]},
          },
        ],
        noticeBox: { title: "Tell the team if you experience:", items: [
          "A previous bad experience at the dentist.",
          "Fear of needles, the drill, choking, or gagging.",
          "Sensitive teeth, a strong gag reflex, or jaw issues.",
          "Panic attacks, claustrophobia, or PTSD.",
          "Any medication, including for anxiety, you're currently taking.",
        ]},
      },
    ],
  },

  /* ─── 45 · Oral Care for Seniors ──────────────────────────────────────── */
  {
    id: "seniors",
    num: "45",
    ref: "PI-SEN-01",
    category: "other",
    title: "Oral Care for Seniors",
    summary: "Receding gums, dry mouth, and the link to general health.",
    intro: "Our dental needs change as we get older. Looking after the mouth at this stage is about more than appearance: it affects what you can eat, how comfortable you are, and your general health.",
    pages: [
      {
        eyebrow: "Specialist Care",
        sections: [
          { kind: "numbered", title: "Common Age-Related Dental Challenges", items: [
            { title: "Receding gums.", body: "It is common for gum tissue to recede over time, exposing the softer root surfaces of the teeth. The teeth can look \"longer\" and may become sensitive at the gumline." },
            { title: "Root decay.", body: "Because root surfaces lack the hard protective enamel that covers the rest of the tooth, they are significantly more susceptible to decay once exposed. This is the most common cause of new cavities later in life." },
            { title: "Dry mouth (xerostomia).", body: "Many medicines used in later life — for blood pressure, cholesterol, depression or sleep — reduce saliva flow. Saliva is the mouth's primary defence against decay, so a dry mouth noticeably increases the risk of decay." },
            { title: "Denture wear & fit.", body: "Jawbones gradually change shape after teeth are lost, so dentures that once fitted perfectly can become loose. Loose dentures cause sore spots, difficulty eating, and a less confident smile — a reline or remake usually solves it." },
          ]},
          { kind: "prose", title: "The Oral–Systemic Connection", intro: "Research increasingly shows that the health of the mouth and the rest of the body are deeply linked — and the connection is strongest in later life.", items: [
            { lead: "Heart disease.", body: "Chronic gum inflammation is associated with a higher risk of heart disease and stroke. Inflammation can affect the rest of the body too." },
            { lead: "Diabetes.", body: "Gum disease can make blood sugar harder to control, and uncontrolled blood sugar makes gum infections worse. Treating one helps the other." },
            { lead: "Pneumonia & chest infections.", body: "Bacteria from the mouth can be inhaled into the lungs and cause respiratory infections — a particular concern for frailer patients and those in hospital or care." },
            { lead: "Nutrition & cognition.", body: "Painful teeth or ill-fitting dentures change what people can eat. Soft, low-protein diets accelerate frailty — and good oral health supports independence for longer." },
          ]},
        ],
        callout: { title: "Our goal", body: "Whatever your starting point, whether that is natural teeth, partial dentures or full dentures, we are here to help you keep what you have working comfortably for as long as possible." },
        notice: { title: "Don't put it off", body: "A loose tooth, bleeding gums or a sore spot under a denture is unlikely to settle on its own. These problems are usually easier to fix the sooner we see them, so please book in if something has changed." },
      },
      {
        eyebrow: "Daily Care & Maintenance",
        pageTitle: "Practical Tips for Daily Care",
        intro: "Small changes to your daily routine can make a real difference. Use this page as a reminder, and bring it with you to your next appointment if you would like to go through any of it together.",
        sections: [
          { kind: "list", title: "Your Daily Routine", items: [
            { title: "Switch to an electric toothbrush.", tag: "EVERY BRUSH", body: "If arthritis or limited dexterity makes brushing harder, an electric brush with a wider, ergonomic handle does more of the work for you — and is significantly more effective." },
            { title: "Use a high-fluoride toothpaste if we've recommended one.", tag: "TWICE DAILY", body: "Specialist high-fluoride toothpastes (e.g. 2,800 or 5,000 ppm) help strengthen exposed roots and offset the effects of dry mouth. Available on prescription." },
            { title: "Sip water through the day.", tag: "CONTINUALLY", body: "Frequent sips help rinse the teeth and compensate for reduced saliva. A glass of water by the bed and another by your favourite chair makes it easier to remember." },
            { title: "Clean between teeth daily.", tag: "ONCE A DAY", body: "If string floss is fiddly, interdental brushes or a water flosser are usually easier and clean more effectively around bridges, crowns and implants." },
            { title: "Spit, don't rinse.", tag: "AFTER BRUSHING", body: "Rinsing washes the protective fluoride straight off the teeth. Just spit the foam out and leave the rest." },
          ]},
          { kind: "compare", title: "Do & Avoid",
            left:  { title: "Do", items: [
              "Bring an up-to-date list of your medicines to every check-up — many affect the mouth.",
              "Try a sugar-free dry-mouth gel or spray (e.g. Biotène, BioXtra) if your mouth feels dry.",
              "Chew sugar-free gum after meals to stimulate saliva.",
              "Attend an annual exam even if you wear full dentures — we screen for oral cancer and check soft tissues.",
              "Tell us straight away if a denture rubs, a tooth becomes loose, or a sore lasts more than two weeks.",
            ]},
            right: { title: "Avoid", items: [
              "Sleeping in your dentures — gums need time to \"breathe\" to stay healthy.",
              "Frequent sipping of sugary tea, coffee, squashes or fruit juice through the day.",
              "Putting up with a loose denture or persistent sore spot — both have simple solutions.",
              "Using denture adhesive to mask a poor fit — it can hide a developing problem.",
              "Skipping check-ups because \"everything feels fine\" — many issues are silent.",
            ]},
          },
          { kind: "list", title: "Caring for Dentures", items: [
            { title: "Brush your dentures every day.", tag: "TWICE DAILY", body: "Use a soft denture brush and mild soap or denture cleaner — not toothpaste, which is too abrasive and can scratch the surface." },
            { title: "Take dentures out at night.", tag: "EVERY NIGHT", body: "Soak them in cool water or a denture-cleaning solution. Letting the gums rest helps prevent fungal infections such as oral thrush." },
            { title: "Clean your gums and tongue too.", tag: "TWICE DAILY", body: "Even with no natural teeth, gently brushing the gums, palate and tongue with a soft brush keeps the soft tissues healthy." },
            { title: "Have dentures reviewed every 1–2 years.", tag: "ROUTINE", body: "Even well-loved dentures need relining or remaking as the jawbone gradually changes." },
          ]},
        ],
        noticeBox: { title: "Call the practice if you notice:", items: [
          "A loose tooth, or a bite that has suddenly changed.",
          "Bleeding gums, a persistent bad taste, or a swelling.",
          "A sore patch, ulcer or white/red area in the mouth lasting more than two weeks.",
          "A denture that has become loose, rubs, or no longer fits comfortably.",
          "A new dry-mouth feeling after starting a new medicine.",
        ]},
      },
    ],
  },
];

/** Quick lookup */
export const findPilCategory = (slug) => pilCategories.find((c) => c.slug === slug);
export const findPil = (id) => pilsFixture.find((p) => p.id === id);
