import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Modal } from '../../components/ui/modal'
import { ProductForm } from '../../components/products/ProductForm'
import { ProductList } from '../../components/products/ProductList'
import { getProducts, createProduct, updateProduct } from '../../lib/api'
import type { Product } from '../../types'

export default function AdminProducts() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const queryClient = useQueryClient()

  // Fetch Products
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      closeModal()
    },
  })

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Product> }) =>
      updateProduct(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      closeModal()
    },
  })

  const handleCreate = async (data: any) => {
    await createMutation.mutateAsync(data)
  }

  const handleUpdate = async (data: any) => {
    if (!editingProduct) return
    await updateMutation.mutateAsync({ id: editingProduct.id, updates: data })
  }

  const openCreateModal = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  const isSaving = createMutation.isPending || updateMutation.isPending

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-slate-900'>
            Products
          </h1>
          <p className='text-slate-500'>
            Manage products available for affiliates.
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className='mr-2 h-4 w-4' />
          Add Product
        </Button>
      </div>

      <ProductList
        products={products}
        isLoading={isLoadingProducts}
        onEdit={openEditModal}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingProduct ? 'Edit Product' : 'New Product'}>
        <ProductForm
          initialData={editingProduct}
          onSubmit={editingProduct ? handleUpdate : handleCreate}
          isLoading={isSaving}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  )
}
