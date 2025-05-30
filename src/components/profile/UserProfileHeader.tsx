
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CalendarIcon, MapPin, Mail, Edit } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from '@/api/users';

interface UserProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  onEditProfile?: () => void;
}

const UserProfileHeader = ({ user, isOwnProfile, onEditProfile }: UserProfileHeaderProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.profileImageUrl} alt={user.name} />
          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-1">
              {user.name}
            </h1>
            
            {isOwnProfile && onEditProfile && (
              <Button 
                onClick={onEditProfile} 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Редактировать профиль
              </Button>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600 mt-3">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{user.location || 'Не указан'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              <span>На сайте с {format(new Date(user.dateCreated), 'MMMM yyyy', { locale: ru })}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="font-medium text-lg mb-2">О себе</h3>
        <p className="text-gray-700">{user.bio || 'Информация о себе не указана'}</p>
      </div>
    </div>
  );
};

export default UserProfileHeader;
