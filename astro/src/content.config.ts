import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const experience = defineCollection({
	loader: glob({ pattern: '**/*.json', base: './src/content/experience' }),
	schema: z.object({
		order: z.number(),
		dates: z.string(),
		role: z.string(),
		company: z.string(),
		meta: z.string(),
		bullets: z.array(z.string()),
	}),
});

const projects = defineCollection({
	loader: glob({ pattern: '**/*.json', base: './src/content/projects' }),
	schema: z.object({
		order: z.number(),
		placement: z.enum(['highlight', 'featured', 'secondary']),
		variant: z.enum(['case', 'incident', 'flip']).optional(),
		kicker: z.string().optional(),
		title: z.string(),
		story: z.string(),
		note: z.string().optional(),
		bullets: z.array(z.string()).optional(),
		caseStudy: z
			.array(
				z.object({
					label: z.string(),
					body: z.string(),
				}),
			)
			.optional(),
		stack: z.array(z.string()),
		links: z
			.array(
				z.object({
					label: z.string(),
					href: z.string(),
					style: z.enum(['primary', 'ghost']),
					rel: z.string().optional(),
				}),
			)
			.optional(),
		image: z
			.object({
				src: z.string(),
				webp: z.string().optional(),
				alt: z.string(),
				width: z.number().optional(),
				height: z.number().optional(),
			})
			.optional(),
	}),
});

const certifications = defineCollection({
	loader: glob({ pattern: '**/*.json', base: './src/content/certifications' }),
	schema: z.object({
		order: z.number(),
		title: z.string(),
		description: z.string(),
		href: z.string(),
		linkLabel: z.string(),
		rel: z.string().optional(),
	}),
});

const education = defineCollection({
	loader: glob({ pattern: '**/*.json', base: './src/content/education' }),
	schema: z.object({
		order: z.number(),
		dates: z.string(),
		degree: z.string(),
		school: z.string(),
		location: z.string(),
		details: z.array(z.string()),
		shortRule: z.boolean().optional(),
	}),
});

const skills = defineCollection({
	loader: glob({ pattern: '**/*.json', base: './src/content/skills' }),
	schema: z.object({
		order: z.number(),
		column: z.union([z.literal(1), z.literal(2)]),
		title: z.string(),
		tags: z.array(z.string()),
	}),
});

const site = defineCollection({
	loader: glob({ pattern: 'config.json', base: './src/content/site' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		canonical: z.string(),
		brand: z.string(),
		nav: z.array(
			z.object({
				href: z.string(),
				label: z.string(),
			}),
		),
		resume: z.object({
			label: z.string(),
			href: z.string(),
		}),
		social: z.array(
			z.object({
				href: z.string(),
				label: z.string(),
				icon: z.enum(['linkedin', 'github']),
			}),
		),
		meta: z.object({
			ogType: z.string(),
			ogTitle: z.string(),
			ogDescription: z.string(),
			ogUrl: z.string(),
			ogImage: z.string(),
			ogImageType: z.string(),
			ogImageWidth: z.string(),
			ogImageHeight: z.string(),
			ogImageAlt: z.string(),
			twitterCard: z.string(),
			twitterTitle: z.string(),
			twitterDescription: z.string(),
			twitterImage: z.string(),
		}),
		hero: z.object({
			lines: z.array(
				z.object({
					text: z.string(),
					accent: z.string().optional(),
				}),
			),
			tagline: z.string(),
			subtitle: z.string(),
		}),
		sections: z.object({
			about: z.string(),
			experience: z.string(),
			certifications: z.string(),
			skills: z.string(),
			projects: z.string(),
			moreProjects: z.string(),
			education: z.string(),
			contact: z.string(),
		}),
		about: z.object({
			title: z.string(),
			paragraphs: z.array(z.string()),
			emailLabel: z.string(),
			email: z.string(),
			photo: z.object({
				jpg: z.string(),
				webp: z.string(),
				alt: z.string(),
				width: z.number(),
				height: z.number(),
			}),
		}),
		certificationsNote: z.string(),
		contact: z.object({
			name: z.string(),
			tagline: z.string(),
			emailLabel: z.string(),
			email: z.string(),
			locationLabel: z.string(),
			location: z.string(),
			emailCta: z.string(),
			linkedinCta: z.string(),
		}),
		footer: z.string(),
	}),
});

export const collections = { experience, projects, certifications, education, skills, site };
