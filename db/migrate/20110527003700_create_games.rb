class CreateGames < ActiveRecord::Migration
  def self.up
    create_table :games do |t|
      t.string :title
      t.integer :width
      t.integer :height
      t.binary :gamedata

      t.timestamps
    end
  end

  def self.down
    drop_table :games
  end
end
