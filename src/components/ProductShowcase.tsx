import { useState } from 'react';
import { useCountry } from '@/contexts/CountryContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingBag, Star, ExternalLink, TrendingUp, Heart } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  nameEn: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  sold: string;
  soldEn: string;
  image: string;
  rating: number;
  affiliateUrl: string;
  tag?: string;
  tagEn?: string;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Macacão Bebê com Vestido Manuela',
    nameEn: 'Baby Romper with Dress Manuela',
    price: 'R$ 78,90',
    originalPrice: 'R$ 98,63',
    discount: '-20%',
    sold: '2mil+ Vendidos',
    soldEn: '2k+ Sold',
    image: 'https://down-bs-br.img.susercontent.com/br-11134211-7qukw-lix4vtcc8pz346.avif',
    rating: 4.8,
    affiliateUrl: 'https://collshp.com/mamaezenshopping',
    tag: 'Indicado',
    tagEn: 'Recommended',
  },
  {
    id: 2,
    name: 'Saída de Maternidade de Luxo MENINA Kit Completo',
    nameEn: 'Luxury Maternity Set GIRL Complete Kit',
    price: 'R$ 107,33',
    originalPrice: 'R$ 149,07',
    discount: '-28%',
    sold: '2mil+ Vendidos',
    soldEn: '2k+ Sold',
    image: 'https://down-bs-br.img.susercontent.com/br-11134207-820lc-mlc2kifpdfd13b.avif',
    rating: 4.9,
    affiliateUrl: 'https://collshp.com/mamaezenshopping',
    tag: 'Indicado',
    tagEn: 'Recommended',
  },
  {
    id: 3,
    name: 'Saída de Maternidade Luxo Kit 5 Peças - 100% Algodão',
    nameEn: 'Luxury Maternity Set 5 Pieces - 100% Cotton',
    price: 'R$ 180,41',
    originalPrice: 'R$ 189,91',
    discount: '-5%',
    sold: '550 Vendidos',
    soldEn: '550 Sold',
    image: 'https://down-bs-br.img.susercontent.com/br-11134207-81ztc-mkifnvsnmdc210.avif',
    rating: 4.7,
    affiliateUrl: 'https://collshp.com/mamaezenshopping',
  },
  {
    id: 4,
    name: 'Body Temático Bolofofo Mesversário Bebê',
    nameEn: 'Themed Baby Body Monthly Birthday',
    price: 'R$ 24,90',
    sold: '824 Vendidos',
    soldEn: '824 Sold',
    image: 'https://down-bs-br.img.susercontent.com/br-11134207-81ztc-miuklvbu8b2abb.avif',
    rating: 4.6,
    affiliateUrl: 'https://collshp.com/mamaezenshopping',
  },
  {
    id: 5,
    name: 'Body Bebê Feminino Temático Mesversário 100% Algodão',
    nameEn: 'Baby Girl Themed Monthly Body 100% Cotton',
    price: 'R$ 9,81',
    originalPrice: 'R$ 9,91',
    discount: '-1%',
    sold: '3mil+ Vendidos',
    soldEn: '3k+ Sold',
    image: 'https://down-bs-br.img.susercontent.com/br-11134207-81z1k-mesz50q076ddcd.avif',
    rating: 4.9,
    affiliateUrl: 'https://collshp.com/mamaezenshopping',
    tag: 'Mais Vendido',
    tagEn: 'Best Seller',
  },
  {
    id: 6,
    name: 'Macacão Manga Longa Bebê Menina com Lacinhos Manu',
    nameEn: 'Long Sleeve Baby Girl Romper with Bows Manu',
    price: 'R$ 54,00',
    originalPrice: 'R$ 67,50',
    discount: '-20%',
    sold: '1mil+ Vendidos',
    soldEn: '1k+ Sold',
    image: 'https://down-bs-br.img.susercontent.com/br-11134207-7r98o-mbsckuztbwyv4d.avif',
    rating: 4.8,
    affiliateUrl: 'https://collshp.com/mamaezenshopping',
    tag: 'Indicado',
    tagEn: 'Recommended',
  },
  {
    id: 7,
    name: 'Kit Enxoval Bebê Menina 20 Peças Completo',
    nameEn: 'Baby Girl Layette Kit 20 Pieces Complete',
    price: 'R$ 189,90',
    originalPrice: 'R$ 249,90',
    discount: '-24%',
    sold: '1.5mil+ Vendidos',
    soldEn: '1.5k+ Sold',
    image: 'https://down-bs-br.img.susercontent.com/br-11134207-81ztc-mkifnvsnmdc210.avif',
    rating: 4.8,
    affiliateUrl: 'https://collshp.com/mamaezenshopping',
    tag: 'Oferta',
    tagEn: 'Deal',
  },
  {
    id: 8,
    name: 'Vestido Infantil Princesa Festa Luxo com Tiara',
    nameEn: 'Kids Princess Luxury Party Dress with Tiara',
    price: 'R$ 89,90',
    originalPrice: 'R$ 129,90',
    discount: '-31%',
    sold: '980 Vendidos',
    soldEn: '980 Sold',
    image: 'https://down-bs-br.img.susercontent.com/br-11134211-7qukw-lix4vtcc8pz346.avif',
    rating: 4.7,
    affiliateUrl: 'https://collshp.com/mamaezenshopping',
  },
  {
    id: 9,
    name: 'Babador Bandana Bebê Kit 10 Unidades Algodão',
    nameEn: 'Baby Bandana Bib Kit 10 Units Cotton',
    price: 'R$ 29,90',
    originalPrice: 'R$ 49,90',
    discount: '-40%',
    sold: '5mil+ Vendidos',
    soldEn: '5k+ Sold',
    image: 'https://down-bs-br.img.susercontent.com/br-11134207-81ztc-miuklvbu8b2abb.avif',
    rating: 4.9,
    affiliateUrl: 'https://collshp.com/mamaezenshopping',
    tag: 'Mais Vendido',
    tagEn: 'Best Seller',
  },
  {
    id: 10,
    name: 'Manta Cobertor Bebê Microfibra Premium Bordado',
    nameEn: 'Premium Embroidered Microfiber Baby Blanket',
    price: 'R$ 45,90',
    originalPrice: 'R$ 69,90',
    discount: '-34%',
    sold: '2mil+ Vendidos',
    soldEn: '2k+ Sold',
    image: 'https://down-bs-br.img.susercontent.com/br-11134207-820lc-mlc2kifpdfd13b.avif',
    rating: 4.8,
    affiliateUrl: 'https://collshp.com/mamaezenshopping',
    tag: 'Indicado',
    tagEn: 'Recommended',
  },
  {
    id: 11,
    name: 'Sapato Bebê Menina Primeiro Passo Antiderrapante',
    nameEn: 'Baby Girl First Step Non-Slip Shoes',
    price: 'R$ 39,90',
    originalPrice: 'R$ 59,90',
    discount: '-33%',
    sold: '3mil+ Vendidos',
    soldEn: '3k+ Sold',
    image: 'https://down-bs-br.img.susercontent.com/br-11134207-7r98o-mbsckuztbwyv4d.avif',
    rating: 4.7,
    affiliateUrl: 'https://collshp.com/mamaezenshopping',
  },
  {
    id: 12,
    name: 'Kit Higiene Bebê 5 Peças Porcelana Decorado',
    nameEn: 'Baby Hygiene Kit 5 Pieces Decorated Porcelain',
    price: 'R$ 119,90',
    originalPrice: 'R$ 159,90',
    discount: '-25%',
    sold: '750 Vendidos',
    soldEn: '750 Sold',
    image: 'https://down-bs-br.img.susercontent.com/br-11134207-81z1k-mesz50q076ddcd.avif',
    rating: 4.6,
    affiliateUrl: 'https://collshp.com/mamaezenshopping',
  },
  {
    id: 13,
    name: 'Bolsa Maternidade Grande com Trocador Impermeável',
    nameEn: 'Large Maternity Bag with Waterproof Changing Pad',
    price: 'R$ 149,90',
    originalPrice: 'R$ 199,90',
    discount: '-25%',
    sold: '1.8mil+ Vendidos',
    soldEn: '1.8k+ Sold',
    image: 'https://down-bs-br.img.susercontent.com/br-11134207-81ztc-mkifnvsnmdc210.avif',
    rating: 4.9,
    affiliateUrl: 'https://collshp.com/mamaezenshopping',
    tag: 'Indicado',
    tagEn: 'Recommended',
  },
  {
    id: 14,
    name: 'Pijama Bebê Menina Manga Longa Algodão Kit 3 Peças',
    nameEn: 'Baby Girl Long Sleeve Cotton Pajama Kit 3 Pieces',
    price: 'R$ 59,90',
    originalPrice: 'R$ 89,90',
    discount: '-33%',
    sold: '2.5mil+ Vendidos',
    soldEn: '2.5k+ Sold',
    image: 'https://down-bs-br.img.susercontent.com/br-11134211-7qukw-lix4vtcc8pz346.avif',
    rating: 4.8,
    affiliateUrl: 'https://collshp.com/mamaezenshopping',
  },
  {
    id: 15,
    name: 'Organizador de Berço Bebê com Bolsos Multiuso',
    nameEn: 'Baby Crib Organizer with Multi-Use Pockets',
    price: 'R$ 34,90',
    originalPrice: 'R$ 54,90',
    discount: '-36%',
    sold: '1.2mil+ Vendidos',
    soldEn: '1.2k+ Sold',
    image: 'https://down-bs-br.img.susercontent.com/br-11134207-81ztc-miuklvbu8b2abb.avif',
    rating: 4.5,
    affiliateUrl: 'https://collshp.com/mamaezenshopping',
  },
  {
    id: 16,
    name: 'Faixa Turbante Bebê Menina Kit 10 Unidades Laço',
    nameEn: 'Baby Girl Turban Headband Kit 10 Units with Bow',
    price: 'R$ 19,90',
    originalPrice: 'R$ 39,90',
    discount: '-50%',
    sold: '4mil+ Vendidos',
    soldEn: '4k+ Sold',
    image: 'https://down-bs-br.img.susercontent.com/br-11134207-820lc-mlc2kifpdfd13b.avif',
    rating: 4.9,
    affiliateUrl: 'https://collshp.com/mamaezenshopping',
    tag: 'Mais Vendido',
    tagEn: 'Best Seller',
  },
  {
    id: 17,
    name: 'Mordedor Bebê Silicone com Chocalho Refrigerante',
    nameEn: 'Baby Silicone Teether with Cooling Rattle',
    price: 'R$ 15,90',
    originalPrice: 'R$ 29,90',
    discount: '-47%',
    sold: '6mil+ Vendidos',
    soldEn: '6k+ Sold',
    image: 'https://down-bs-br.img.susercontent.com/br-11134207-7r98o-mbsckuztbwyv4d.avif',
    rating: 4.8,
    affiliateUrl: 'https://collshp.com/mamaezenshopping',
    tag: 'Mais Vendido',
    tagEn: 'Best Seller',
  },
  {
    id: 18,
    name: 'Almofada Amamentação Travesseiro Gestante Multifuncional',
    nameEn: 'Multifunctional Nursing Pillow for Pregnant Women',
    price: 'R$ 79,90',
    originalPrice: 'R$ 119,90',
    discount: '-33%',
    sold: '2mil+ Vendidos',
    soldEn: '2k+ Sold',
    image: 'https://down-bs-br.img.susercontent.com/br-11134207-81z1k-mesz50q076ddcd.avif',
    rating: 4.7,
    affiliateUrl: 'https://collshp.com/mamaezenshopping',
    tag: 'Indicado',
    tagEn: 'Recommended',
  },
  {
    id: 19,
    name: 'Conjunto Bebê Menina Verão Kit 5 Peças Fresquinho',
    nameEn: 'Baby Girl Summer Set Kit 5 Pieces Light',
    price: 'R$ 49,90',
    originalPrice: 'R$ 79,90',
    discount: '-38%',
    sold: '1.5mil+ Vendidos',
    soldEn: '1.5k+ Sold',
    image: 'https://down-bs-br.img.susercontent.com/br-11134211-7qukw-lix4vtcc8pz346.avif',
    rating: 4.6,
    affiliateUrl: 'https://collshp.com/mamaezenshopping',
  },
  {
    id: 20,
    name: 'Toalha de Banho Bebê com Capuz Bordada Premium',
    nameEn: 'Premium Embroidered Baby Hooded Bath Towel',
    price: 'R$ 35,90',
    originalPrice: 'R$ 55,90',
    discount: '-36%',
    sold: '3.5mil+ Vendidos',
    soldEn: '3.5k+ Sold',
    image: 'https://down-bs-br.img.susercontent.com/br-11134207-81ztc-mkifnvsnmdc210.avif',
    rating: 4.9,
    affiliateUrl: 'https://collshp.com/mamaezenshopping',
    tag: 'Mais Vendido',
    tagEn: 'Best Seller',
  },
];

const ProductShowcase = () => {
  const { isUSA } = useCountry();
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const handleBuy = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="p-4 bg-card border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-lg text-foreground">
            {isUSA ? 'Mom Shop' : 'Lojinha da Mamãe'}
          </h3>
        </div>
        <Badge variant="secondary" className="text-[10px] font-semibold">
          <TrendingUp className="w-3 h-3 mr-1" />
          {products.length} {isUSA ? 'products' : 'produtos'}
        </Badge>
      </div>

      <p className="text-xs text-muted-foreground mb-4">
        {isUSA
          ? 'Handpicked products for you and your baby. Tap to buy directly!'
          : 'Produtos selecionados com carinho para você e seu bebê. Toque para comprar direto!'}
      </p>

      {/* Product Grid with Scroll */}
      <ScrollArea className="h-[520px] pr-1">
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-muted/50 rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-lg"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={isUSA ? product.nameEn : product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {product.discount && (
                  <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5">
                    {product.discount}
                  </Badge>
                )}
                {product.tag && (
                  <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5">
                    {isUSA ? product.tagEn : product.tag}
                  </Badge>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
                  className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
                >
                  <Heart
                    className={`w-3.5 h-3.5 transition-colors ${
                      favorites.includes(product.id)
                        ? 'fill-destructive text-destructive'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              </div>

              {/* Info */}
              <div className="p-2.5 space-y-1.5">
                <h4 className="text-xs font-semibold text-foreground leading-tight line-clamp-2 min-h-[2rem]">
                  {isUSA ? product.nameEn : product.name}
                </h4>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-2.5 h-2.5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground/30'
                      }`}
                    />
                  ))}
                  <span className="text-[10px] text-muted-foreground ml-0.5">{product.rating}</span>
                </div>
                <div className="space-y-0.5">
                  {product.originalPrice && (
                    <span className="text-[10px] text-muted-foreground line-through block">
                      {product.originalPrice}
                    </span>
                  )}
                  <span className="text-sm font-bold text-primary">{product.price}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {isUSA ? product.soldEn : product.sold}
                </p>
                <Button
                  onClick={() => handleBuy(product.affiliateUrl)}
                  size="sm"
                  className="w-full h-7 text-[10px] font-bold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground rounded-lg"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  {isUSA ? 'Buy Now' : 'Comprar'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer CTA */}
      <div className="mt-4 pt-3 border-t border-border text-center">
        <Button
          onClick={() => handleBuy('https://collshp.com/mamaezenshopping')}
          variant="outline"
          className="w-full border-primary/30 text-primary hover:bg-primary/10 font-semibold"
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          {isUSA ? 'See All Products' : 'Ver Todos os Produtos'}
        </Button>
        <p className="text-[10px] text-muted-foreground mt-2">
          {isUSA ? 'Secure purchase via Shopee' : 'Compra segura via Shopee'}
        </p>
      </div>
    </Card>
  );
};

export default ProductShowcase;
