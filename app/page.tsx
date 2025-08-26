import BannerCarousel, { Promo } from '@/components/BannerCarousel';
import ServiceScroller, { ServiceBanner } from '@/components/ServiceScroller';
import TilerScroller, { Tiler } from '@/components/TilerScroller';


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
  { id:'t1', name:'Kelum Srimal', location:'Gampaha', rating:4.9, jobsCompleted:157, avatar:'/img/tilers/kelum.jpg', badges:['TILERSHUB Certified'], tags:['Bathroom Tiling','Floor Tiling'], profileHref:'/tilers/kelum-srimal', quoteHref:'/request-quote?tiler=kelum-srimal' },
  { id:'t2', name:'Saman Anurudda', location:'Kandy', rating:4.8, jobsCompleted:137, avatar:'/img/tilers/saman.jpg', badges:['Master Tiler'], tags:['Bathroom Tiling','Mosaic','Waterproofing'], profileHref:'/tilers/saman-anurudda', quoteHref:'/request-quote?tiler=saman-anurudda' },
  { id:'t3', name:'Keshara Tile Art', location:'Matara', rating:4.7, jobsCompleted:121, avatar:'/img/tilers/keshara.jpg', badges:['Certified'], tags:['Floor Tiling','Skirting','Stairs/Nosing'] },
  { id:'t4', name:'Ranarata Tile Art', location:'Anuradhapura', rating:4.8, jobsCompleted:164, avatar:'/img/tilers/ranarata.jpg', badges:['Verified'], tags:['Large Format','Bathroom','Grout/Finish'] },
  { id:'t5', name:'Kelum Srimal (Team)', location:'Colombo', rating:5.0, jobsCompleted:210, avatar:'/img/tilers/kelum-team.jpg', badges:['Top Rated'], tags:['Bathroom','Floor','Waterproofing'] },
];

export default function Home() {
  return (
    <main style={{background:'#f6f7f9'}}>

      <div style={{maxWidth:1100, margin:'0 auto', padding:16}}>
        <BannerCarousel slides={promoSlides} />

        {/* CTA just under promo */}
        <div style={{margin:'12px 0'}}>
          <a href="/estimator"
             style={{display:'block',textAlign:'center',padding:'14px 18px',borderRadius:12,background:'#003049',color:'#fff',fontWeight:800,textDecoration:'none'}}>
            Get an Estimate
          </a>
        </div>

        <ServiceScroller services={serviceBanners} />
        <TilerScroller tilers={tilers} />
      </div>

    </main>
  );
}