import { Nav } from '@/app/components/nav/page';

export default function DetalhesId({ params }: { params: { id: string } }) {
  return (
    <div>
      <Nav />
      <div className="p-8">
        <h1 className="text-2xl font-bold">Detalhes do Item {params.id}</h1>
        <p>Detalhes específicos do item.</p>
      </div>
    </div>
  );
}