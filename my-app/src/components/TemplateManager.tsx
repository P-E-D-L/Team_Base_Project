import React, { useState } from 'react';
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Template {
  value: string;
  label: string;
}

interface Environment {
  id: string;
  name: string;
  type: string;
  status: 'deploying' | 'running' | 'failed';
  deployedAt: Date;
}

const TemplateManager: React.FC = () => {
  const [selectedTemplates, setSelectedTemplates] = useState<Template[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [templates, setTemplates] = useState<Template[]>([
    { value: 'web-app', label: 'Web Application' },
    { value: 'database', label: 'Database Server' },
    { value: 'api', label: 'API Service' }
  ]);

  const handleAddTemplates = () => {
    selectedTemplates.forEach(template => {
      const newEnvironment: Environment = {
        id: Math.random().toString(36).substr(2, 9),
        name: `${template.label}-${Math.floor(Math.random() * 1000)}`,
        type: template.label,
        status: 'deploying',
        deployedAt: new Date()
      };
      
      setEnvironments(prev => [...prev, newEnvironment]);

      // Simulate deployment completion
      setTimeout(() => {
        setEnvironments(prev => 
          prev.map(env => 
            env.id === newEnvironment.id 
              ? { ...env, status: 'running' }
              : env
          )
        );
      }, 5000);
    });
    setSelectedTemplates([]);
  };

  const handleDeleteTemplates = () => {
    // Get the labels of templates being deleted
    const templatesBeingDeleted = selectedTemplates.map(t => t.label);
    
    // Remove the templates from available templates
    setTemplates(templates.filter(t => !selectedTemplates.some(s => s.value === t.value)));
    
    // Remove any deployed environments associated with these templates
    setEnvironments(prev => prev.filter(env => !templatesBeingDeleted.includes(env.type)));
    
    setSelectedTemplates([]);
  };

  const toggleTemplate = (template: Template) => {
    setSelectedTemplates(prev => 
      prev.some(t => t.value === template.value)
        ? prev.filter(t => t.value !== template.value)
        : [...prev, template]
    );
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'deploying': return '#ffc107';
      case 'running': return '#28a745';
      case 'failed': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div>
      <div style={styles.container}>
        <h3 style={styles.header}>Template Management</h3>
        
        <div style={styles.templateList}>
          <h4>Available Templates</h4>
          {templates.map((template) => (
            <div 
              key={template.value} 
              style={{
                ...styles.templateItem,
                backgroundColor: selectedTemplates.some(t => t.value === template.value) 
                  ? '#f0f0f0' 
                  : 'transparent',
                cursor: 'pointer'
              }}
              onClick={() => toggleTemplate(template)}
            >
              <span>{template.label}</span>
            </div>
          ))}
        </div>

        {selectedTemplates.length > 0 && (
          <div style={styles.buttonGroup}>
            <button
              onClick={handleAddTemplates}
              style={{
                ...styles.button,
                backgroundColor: '#28a745',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <PlusCircleIcon style={styles.icon} />
              Deploy Templates ({selectedTemplates.length})
            </button>
            <button
              onClick={handleDeleteTemplates}
              style={{
                ...styles.button,
                backgroundColor: '#dc3545',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <TrashIcon style={styles.icon} />
              Delete Templates ({selectedTemplates.length})
            </button>
          </div>
        )}
      </div>

      <div style={styles.container}>
        <h3 style={styles.header}>Deployed Environments</h3>
        {environments.length === 0 ? (
          <p style={styles.emptyState}>No environments currently deployed</p>
        ) : (
          <div style={styles.environmentList}>
            {environments.map((env) => (
              <div key={env.id} style={styles.environmentCard}>
                <div style={styles.environmentInfo}>
                  <span style={styles.environmentName}>{env.name}</span>
                  <span style={styles.environmentType}>{env.type}</span>
                  <span style={{
                    ...styles.status,
                    backgroundColor: getStatusColor(env.status)
                  }}>
                    {env.status}
                  </span>
                  <span style={styles.deployTime}>
                    {new Date(env.deployedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  header: {
    color: '#333',
    marginBottom: '20px',
    fontSize: '18px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
    justifyContent: 'flex-end',
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
    '&:hover': {
      opacity: 0.9,
    },
  },
  templateList: {
    marginTop: '20px',
  },
  templateItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    borderBottom: '1px solid #eee',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  icon: {
    width: '20px',
    height: '20px',
  },
  environmentList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  environmentCard: {
    padding: '12px',
    borderRadius: '6px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #eee',
  },
  environmentInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  environmentName: {
    flex: 1,
    fontSize: '14px',
    fontWeight: '500' as const,
  },
  environmentType: {
    color: '#666',
    fontSize: '14px',
  },
  status: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    color: 'white',
  },
  deployTime: {
    color: '#666',
    fontSize: '12px',
  },
  emptyState: {
    textAlign: 'center' as const,
    color: '#666',
    fontStyle: 'italic' as const,
    margin: '20px 0',
  },
};

export default TemplateManager; 