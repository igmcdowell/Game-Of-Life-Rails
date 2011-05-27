class Game < ActiveRecord::Base
  validates_presence_of :width, :height, :gamedata
  validates_numericality_of :width, :height
  validates_format_of :gamedata, :with => /\A[0,1]*\Z/, :message => "Gamedata must be binary (contain only 0s and 1s)"#make sure the whole string is binary
  #validate :proper_size
  private
  #if the user entered gamedata, ensure that it is the right size (width*length)
  def proper_size
    unless (self.width.to_i * self.height.to_i) == self.gamedata.length || self.gamedata.length.zero?
      self.errors.add :gamedata, '-- The length of gamedata should be equal to the width times height. Your grid is %d pixels by %d pixels, so gamedata should be %d digits' % [self.width, self.height, (self.width.to_i * self.height.to_i)]
    end
  end 
end
