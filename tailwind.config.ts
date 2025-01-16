import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: { 
		backgroundImage: {
			'custom-gradient': 'linear-gradient(to right, #000000, #2e1065, #9d174d)',
			// 'custom-gradient': 'linear-gradient(to right, #000000, #4c1d95)',

		  },
			screens: {
			  sm: '640px', // Small screens
			  md: '768px', // Medium screens
			  lg: '1024px', // Large screens
			  xl: '1280px', // Extra large screens
			  '2xl': '1536px', // 2X large screens 
			  '3xl' : '1980px',
			},
		  fontFamily: {
			zentry: ["zentry", "sans-serif"],
			general: ["general", "sans-serif"],
			"circular-web": ["circular-web", "sans-serif"],
			"robert-medium": ["robert-medium", "sans-serif"],
			"robert-regular": ["robert-regular", "sans-serif"],
		  },
		  colors: {
			blue: {
			  50: "#DFDFF0",
			  75: "#dfdff2",
			  100: "#F0F2FA",
			  200: "#010101",
			  300: "#4FB7DD",
			},
			violet: {
			  300: "#5724ff",
			},
			yellow: {
			  100: "#8e983f",
			  300: "#edff66",
			},
  			background: 'hsl(var(--background))', 
			
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
