import BannerCarousel, { Promo } from '@/components/BannerCarousel';
import ServiceScroller, { ServiceBanner } from '@/components/ServiceScroller';
import TilerScroller, { Tiler } from '@/components/TilerScroller';
import BadgeLegend from '@/components/BadgeLegend';

const promoSlides: Promo[] = [
  { id:'p1', image:'/img/promo-1.jpg', title:'Certified Pros', subtitle:'Book a master tiler', ctaLabel:'Get an Estimate', ctaHref:'/estimator' },
  { id:'p2', image:'/img/promo-2.jpg', title:'Bathroom Renovations', subtitle:'Quality you can trust' },
];

const serviceBanners: ServiceBanner[] = [
  { id:'s1', image:'/img/service-bathroom.jpg', title:'Bathroom Tiling', subline:'Starting from 200 LKR', href:'/services/bathroom-tiling' },
  { id:'s2', image:'/img/service-floor.jpg',     title:'Floor Tiling',    subline:'From 180 LKR',       href:'/services/floor-tiling' },
  { id:'s3', image:'/img/service-waterproof.jpg',title:'Waterproofing',   subline:'Site visit + quote', href:'/services/waterproofing' },
];

const tilers: Tiler[] = [
  {
    id:'t1',
    name:'Kelum Srimal',
    location:'Gampaha',
    rating:4.9,
    jobsCompleted:157,
    avatar:'/img/tilers/kelum.jpg',
    badges:['Master Tiler','Verified Tiler'], // highest shows under avatar
    tags:['Bathroom Tiling','Floor Tiling'],
    profileHref:'/tilers/kelum-srimal',
    quoteHref:'/request-quote?tiler=kelum-srimal'
  },
  {
    id:'t2',
    name:'Saman Anurudda',
    location:'Kandy',
    rating:4.8,
    jobsCompleted:137,
    avatar:'/img/tilers/saman.jpg',
    badges:['Professional Tiler','Verified Tiler'],
    tags:['Bathroom Tiling','Mosaic','Waterproofing'],
    profileHref:'/tilers/saman-anurudda',
    quoteHref:'/request-quote?tiler=saman-anurudda'
  },
  {
    id:'t3',
    name:'Keshara Tile Art',
    location:'Matara',
    rating:4.7,
    jobsCompleted:121,
    avatar:'/img/tilers/keshara.jpg',
    badges:['Certified Tiler','Verified Tiler'],
    tags:['Floor Tiling','Skirting','Stairs/Nosing']
  },
  {
    id:'t4',
    name:'Ranarata Tile Art',
    location:'Anuradhapura',
    rating:4.8,
    jobsCompleted:164,
    avatar:'/img/tilers/ranarata.jpg',
    badges:['Professional Tiler','Verified Tiler'],
    tags:['Large Format','Bathroom','Grout/Finish']
  },
  {
    id:'t5',
    name:'Kelum Srimal (Team)',
    location:'Colombo',
    rating:5.0,
    jobsCompleted:210,
    avatar:'/img/tilers/kelum-team.jpg',
    badges:['Master Tiler','Verified Tiler'],
    tags:['Bathroom','Floor','Waterproofing']
  },
];

export default function Home() {
  return (
    <main className="bg-slate-50">
      <div className="mx-auto max-w-[1100px] px-4 py-4">
        <BannerCarousel slides={promoSlides} />

        <div className="my-3">
          <a href="/estimator" className="block text-center font-extrabold text-white bg-[#003049] px-5 py-3 rounded-xl">
            Get an Estimate
          </a>
        </div>

        <ServiceScroller services={serviceBanners} />
        <TilerScroller tilers={tilers} />
        <BadgeLegend />
      </div>
    </main>
  );
}