import React, { useState } from 'react'
import { useServiceOrders } from '../hooks/useServiceOrders'
import { useAuth } from '../contexts/AuthContext'
import { Package, Calendar, User, AlertTriangle } from 'lucide-react'
import { CustomModal } from './ui/CustomModal'

interface ModalState {
  isOpen: boolean
  type: 'success' | 'error' | 'warning' | 'info' | 'confirm'
  title: string
  message: string
  onConfirm?: () => void
  showCancel?: boolean
  confirmText?: string
}

const DeliverySection: React.FC = () => {
  const { serviceOrders, deliverServiceOrder } = useServiceOrders()
  const { user } = useAuth()
  
  // Estado para el modal
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  })
  
  const [deliveryNotes, setDeliveryNotes] = useState('')

  // Solo mostrar para admin y recepcionista
  if (!user || (user.role !== 'admin' && user.role !== 'receptionist')) {
    return null
  }

  const completedOrders = serviceOrders.filter(order => order.status === 'completed')

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }))
    setDeliveryNotes('')
  }

  const showSuccessModal = (message: string) => {
    setModal({
      isOpen: true,
      type: 'success',
      title: '¡Éxito!',
      message,
      onConfirm: closeModal
    })
  }

  const showErrorModal = (message: string) => {
    setModal({
      isOpen: true,
      type: 'error',
      title: 'Error',
      message,
      onConfirm: closeModal
    })
  }

  const handleDeliverOrder = async (orderId: string) => {
    setDeliveryNotes('')
    
    setModal({
      isOpen: true,
      type: 'confirm',
      title: 'Confirmar Entrega',
      message: '¿Confirmas que el cliente ha recogido su artículo? Puedes agregar notas opcionales:',
      showCancel: true,
      confirmText: 'Confirmar Entrega',
      onConfirm: async () => {
        try {
          await deliverServiceOrder(orderId, deliveryNotes.trim())
          showSuccessModal('Artículo entregado exitosamente al cliente')
        } catch (error) {
          showErrorModal('Error al registrar la entrega')
        }
        closeModal()
      }
    })
  }

  if (completedOrders.length === 0) {
    return null
  }

  return (
    <div className="row mb-3">
      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-transparent border-0 py-3">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-2">
                  <Package size={18} className="text-warning" />
                </div>
                <h5 className="mb-0 fw-semibold">Listas para Entrega</h5>
              </div>
              <span className="badge bg-warning">{completedOrders.length}</span>
            </div>
          </div>
          
          <div className="card-body">
            {completedOrders.length > 0 && (
              <div className="alert alert-warning d-flex align-items-center mb-3">
                <AlertTriangle size={16} className="me-2" />
                <span className="small">
                  Hay {completedOrders.length} reparación{completedOrders.length !== 1 ? 'es' : ''} lista{completedOrders.length !== 1 ? 's' : ''} para entrega
                </span>
              </div>
            )}
            
            <div className="row g-2">
              {completedOrders.slice(0, 6).map(order => (
                <div key={order.id} className="col-md-6 col-lg-4">
                  <div className="card bg-light border-0 h-100">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="flex-grow-1">
                          <h6 className="fw-bold mb-1 text-truncate">
                            {order.device_brand} {order.device_model}
                          </h6>
                          <small className="text-muted d-block">
                            {order.customer?.full_name}
                          </small>
                          <small className="text-primary d-block fw-semibold">
                            #{order.order_number}
                          </small>
                        </div>
                      </div>
                      
                      <p className="small text-muted mb-2 text-truncate">
                        {order.problem_description}
                      </p>
                      
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <small className="text-muted">
                          <Calendar size={12} className="me-1" />
                          {new Date(order.created_at).toLocaleDateString('es-ES')}
                        </small>
                      </div>
                      
                      {order.assigned_technician && (
                        <div className="mb-2">
                          <small className="text-muted">
                            <User size={12} className="me-1" />
                            {order.assigned_technician?.full_name || 
                             order.assigned_technician?.email?.split('@')[0] || 
                             'Técnico'}
                          </small>
                        </div>
                      )}
                      
                      {order.completion_notes && (
                        <div className="mb-2 pt-2 border-top">
                          <small className="text-success">
                            <strong>Notas:</strong> {order.completion_notes}
                          </small>
                        </div>
                      )}
                      
                      <div className="d-grid">
                        <button 
                          className="btn btn-warning btn-sm"
                          onClick={() => handleDeliverOrder(order.id)}
                        >
                          <Package size={12} className="me-1" />
                          Marcar como Entregada
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {completedOrders.length > 6 && (
              <div className="text-center mt-3">
                <small className="text-muted">
                  Y {completedOrders.length - 6} reparación{completedOrders.length - 6 !== 1 ? 'es' : ''} más...
                </small>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Custom Modal */}
      <CustomModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        onConfirm={modal.onConfirm}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        showCancel={modal.showCancel}
        confirmText={modal.confirmText}
        showTextInput={modal.type === 'confirm'}
        textInputValue={deliveryNotes}
        onTextInputChange={setDeliveryNotes}
        textInputPlaceholder="Notas adicionales de entrega (opcional)..."
        textInputRequired={false}
      />
    </div>
  )
}

export default DeliverySection