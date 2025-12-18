import { createContext, useContext, useState, ReactNode } from 'react';
import { 
  clients as initialClients, 
  labours as initialLabours, 
  resources as initialResources,
  Client,
  Labour,
  Resource
} from '@/data/mockData';

interface DataContextType {
  clients: Client[];
  labours: Labour[];
  resources: Resource[];
  addClient: (client: Omit<Client, 'id' | 'dateAdded' | 'financialRecords' | 'resourceUsage'>) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addLabour: (labour: Omit<Labour, 'id' | 'dateJoined' | 'attendance' | 'financialRecords'>) => void;
  updateLabour: (id: string, data: Partial<Labour>) => void;
  deleteLabour: (id: string) => void;
  addResource: (resource: Omit<Resource, 'id' | 'used' | 'remaining' | 'startDate' | 'endDate'>) => void;
  updateResource: (id: string, data: Partial<Resource>) => void;
  deleteResource: (id: string) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [labours, setLabours] = useState<Labour[]>(initialLabours);
  const [resources, setResources] = useState<Resource[]>(initialResources);

  const addClient = (data: Omit<Client, 'id' | 'dateAdded' | 'financialRecords' | 'resourceUsage'>) => {
    const newClient: Client = {
      id: String(Date.now()),
      ...data,
      dateAdded: new Date().toISOString().split('T')[0],
      financialRecords: [],
      resourceUsage: [],
    };
    setClients(prev => [newClient, ...prev]);
  };

  const updateClient = (id: string, data: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const addLabour = (data: Omit<Labour, 'id' | 'dateJoined' | 'attendance' | 'financialRecords'>) => {
    const newLabour: Labour = {
      id: String(Date.now()),
      ...data,
      dateJoined: new Date().toISOString().split('T')[0],
      attendance: [],
      financialRecords: [],
    };
    setLabours(prev => [newLabour, ...prev]);
  };

  const updateLabour = (id: string, data: Partial<Labour>) => {
    setLabours(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
  };

  const deleteLabour = (id: string) => {
    setLabours(prev => prev.filter(l => l.id !== id));
  };

  const addResource = (data: Omit<Resource, 'id' | 'used' | 'remaining' | 'startDate' | 'endDate'>) => {
    const newResource: Resource = {
      id: String(Date.now()),
      ...data,
      used: 0,
      remaining: data.quantityPurchased,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    setResources(prev => [newResource, ...prev]);
  };

  const updateResource = (id: string, data: Partial<Resource>) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
  };

  const deleteResource = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  return (
    <DataContext.Provider value={{
      clients,
      labours,
      resources,
      addClient,
      updateClient,
      deleteClient,
      addLabour,
      updateLabour,
      deleteLabour,
      addResource,
      updateResource,
      deleteResource,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
