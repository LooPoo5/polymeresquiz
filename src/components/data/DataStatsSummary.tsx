
import React from 'react';
import { BarChart3, BookOpen, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface DataStatsSummaryProps {
  quizCount: number;
  resultCount: number;
  participantCount: number;
}

const DataStatsSummary: React.FC<DataStatsSummaryProps> = ({
  quizCount,
  resultCount,
  participantCount
}) => {
  const statCards = [
    {
      title: "Quiz créés",
      value: quizCount,
      icon: BookOpen,
      color: "bg-blue-50 text-blue-600",
      iconColor: "text-blue-500"
    },
    {
      title: "Résultats",
      value: resultCount,
      icon: BarChart3,
      color: "bg-green-50 text-green-600",
      iconColor: "text-green-500"
    },
    {
      title: "Participants",
      value: participantCount,
      icon: Users,
      color: "bg-amber-50 text-amber-600",
      iconColor: "text-amber-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`rounded-lg p-5 shadow-sm border ${stat.color} bg-white`}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-full ${stat.color} bg-opacity-20`}>
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DataStatsSummary;
