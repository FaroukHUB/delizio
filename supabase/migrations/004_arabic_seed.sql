-- Delizio - Migration 004 : ajouter les noms arabes aux produits seedés
-- À exécuter dans le SQL Editor APRÈS 003_storage_policy.sql

-- Fromages
update products set name_ar = 'موزاريلا'        where name = 'Mozzarella'        and name_ar is null;
update products set name_ar = 'بورسان'           where name = 'Boursin'           and name_ar is null;
update products set name_ar = 'جبن الماعز'      where name = 'Chèvre'            and name_ar is null;
update products set name_ar = 'راكليت'           where name = 'Raclette'          and name_ar is null;
update products set name_ar = 'غرويير'           where name = 'Gruyère'           and name_ar is null;
update products set name_ar = 'إيمنتال'          where name = 'Emmental'          and name_ar is null;
update products set name_ar = 'جبن أزرق'        where name = 'Bleu'              and name_ar is null;
update products set name_ar = 'شيدر'             where name = 'Cheddar'           and name_ar is null;
update products set name_ar = 'كومتيه'          where name = 'Comté'             and name_ar is null;
update products set name_ar = 'بارميزان مبشور'  where name = 'Parmesan râpé'     and name_ar is null;
update products set name_ar = 'رقائق بارميزان'  where name = 'Parmesan copeaux'  and name_ar is null;
update products set name_ar = 'بوراتا'           where name = 'Burrata'           and name_ar is null;

-- Viandes / protéines
update products set name_ar = 'صدر دجاج'         where name = 'Filet de poulet'   and name_ar is null;
update products set name_ar = 'لحم ديك رومي'    where name = 'Jambon de dinde'   and name_ar is null;
update products set name_ar = 'لاردون مدخن'     where name = 'Lardons fumés'     and name_ar is null;
update products set name_ar = 'لحم بقر مفروم'  where name = 'Boeuf haché'       and name_ar is null;
update products set name_ar = 'مرقاز'            where name = 'Merguez'           and name_ar is null;
update products set name_ar = 'شوريزو'           where name = 'Chorizo'           and name_ar is null;
update products set name_ar = 'تونة'             where name = 'Thon'              and name_ar is null;
update products set name_ar = 'سلمون مدخن'      where name = 'Saumon fumé'       and name_ar is null;

-- Légumes / crudités
update products set name_ar = 'فطر'              where name = 'Champignons'       and name_ar is null;
update products set name_ar = 'بطاطا'            where name = 'Pommes de terre'   and name_ar is null;
update products set name_ar = 'بصل أحمر'         where name = 'Oignons rouges'    and name_ar is null;
update products set name_ar = 'فلفل حلو'         where name = 'Poivrons'          and name_ar is null;
update products set name_ar = 'طماطم كرزية'     where name = 'Tomates cerises'   and name_ar is null;
update products set name_ar = 'زيتون أسود'      where name = 'Olives noires'     and name_ar is null;
update products set name_ar = 'جرجير'            where name = 'Roquette'          and name_ar is null;
update products set name_ar = 'فلفل هالابينو'   where name = 'Piments jalapeños' and name_ar is null;
update products set name_ar = 'خس'               where name = 'Salade'            and name_ar is null;
update products set name_ar = 'جزر'              where name = 'Carottes'          and name_ar is null;
update products set name_ar = 'ذرة'              where name = 'Maïs'              and name_ar is null;

-- Bases / sauces industrielles
update products set name_ar = 'صلصة طماطم'      where name = 'Sauce tomate'      and name_ar is null;
update products set name_ar = 'كريمة طازجة'     where name = 'Crème fraîche'     and name_ar is null;
update products set name_ar = 'كريمة برزيدان'  where name = 'Crème Président'   and name_ar is null;
update products set name_ar = 'صلصة الكاري'    where name = 'Sauce curry'       and name_ar is null;
update products set name_ar = 'صلصة جزائرية'  where name = 'Sauce algérienne'  and name_ar is null;
update products set name_ar = 'صلصة تايلندية' where name = 'Sauce thaï'        and name_ar is null;
update products set name_ar = 'صلصة باربكيو'   where name = 'Sauce barbecue'    and name_ar is null;
update products set name_ar = 'كريمة الكمأة'   where name = 'Crème de truffe'   and name_ar is null;
update products set name_ar = 'زيت الكمأة'     where name = 'Huile de truffe'   and name_ar is null;
update products set name_ar = 'كريمة بلسمية'   where name = 'Crème balsamique'  and name_ar is null;
update products set name_ar = 'عسل'              where name = 'Miel'              and name_ar is null;

-- Condiments / épices / sec
update products set name_ar = 'زعتر'             where name = 'Origan'            and name_ar is null;
update products set name_ar = 'بهارات الدجاج'  where name = 'Épices poulet'     and name_ar is null;
update products set name_ar = 'ملح'              where name = 'Sel'               and name_ar is null;
update products set name_ar = 'فلفل أسود'        where name = 'Poivre'            and name_ar is null;
update products set name_ar = 'سكر'              where name = 'Sucre'             and name_ar is null;
update products set name_ar = 'دقيق'             where name = 'Farine'            and name_ar is null;
update products set name_ar = 'سميد'             where name = 'Semoule'           and name_ar is null;
update products set name_ar = 'كروتون'           where name = 'Croûtons'          and name_ar is null;

-- Desserts / pâtisserie
update products set name_ar = 'كريمة تيراميسو'  where name = 'Crème tiramisu'    and name_ar is null;
update products set name_ar = 'كريمة شانتيي'   where name = 'Chantilly'         and name_ar is null;
update products set name_ar = 'تارت دايم'        where name = 'Tarte Daim'        and name_ar is null;
update products set name_ar = 'أوريو'            where name = 'Oreo'              and name_ar is null;
update products set name_ar = 'دايم'             where name = 'Daim'              and name_ar is null;
update products set name_ar = 'سبيكولوس'         where name = 'Speculoos'         and name_ar is null;
update products set name_ar = 'بسكويت بريتون'   where name = 'Galette bretonne'  and name_ar is null;
update products set name_ar = 'صلصة كراميل'    where name = 'Coulis caramel'    and name_ar is null;

-- Emballages / entretien
update products set name_ar = 'علب بيتزا 26 سم' where name = 'Boîtes pizza 26 cm' and name_ar is null;
update products set name_ar = 'علب بيتزا 31 سم' where name = 'Boîtes pizza 31 cm' and name_ar is null;
update products set name_ar = 'علب بيتزا 40 سم' where name = 'Boîtes pizza 40 cm' and name_ar is null;
update products set name_ar = 'أكياس كرافت'     where name = 'Sacs kraft'        and name_ar is null;
update products set name_ar = 'مناديل'           where name = 'Serviettes'        and name_ar is null;
update products set name_ar = 'سوبالين'          where name = 'Sopalin'           and name_ar is null;
update products set name_ar = 'قفازات'           where name = 'Gants'             and name_ar is null;
update products set name_ar = 'ورق طبخ'          where name = 'Papier cuisson'    and name_ar is null;
update products set name_ar = 'فيلم غذائي'      where name = 'Film alimentaire'  and name_ar is null;
update products set name_ar = 'ألمنيوم'          where name = 'Aluminium'         and name_ar is null;
update products set name_ar = 'علب صلصة'         where name = 'Pots sauce'        and name_ar is null;
update products set name_ar = 'حاويات'           where name = 'Barquettes'        and name_ar is null;
