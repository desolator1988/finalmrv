# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting model 'EquationGroup'
        db.delete_table(u'allometric_equationgroup')

        # Adding model 'EquationType'
        db.create_table(u'allometric_equationtype', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=1)),
        ))
        db.send_create_signal(u'allometric', ['EquationType'])

        # Deleting field 'Equation.group'
        db.delete_column(u'allometric_equation', 'group_id')

        # Adding field 'Equation.equationtype'
        db.add_column(u'allometric_equation', 'equationtype',
                      self.gf('django.db.models.fields.related.ForeignKey')(to=orm['allometric.EquationType'], null=True),
                      keep_default=False)

        # Deleting field 'EquationRegion.group'
        db.delete_column(u'allometric_equationregion', 'group_id')


    def backwards(self, orm):
        # Adding model 'EquationGroup'
        db.create_table(u'allometric_equationgroup', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=1)),
        ))
        db.send_create_signal(u'allometric', ['EquationGroup'])

        # Deleting model 'EquationType'
        db.delete_table(u'allometric_equationtype')

        # Adding field 'Equation.group'
        db.add_column(u'allometric_equation', 'group',
                      self.gf('django.db.models.fields.related.ForeignKey')(to=orm['allometric.EquationGroup'], null=True),
                      keep_default=False)

        # Deleting field 'Equation.equationtype'
        db.delete_column(u'allometric_equation', 'equationtype_id')

        # Adding field 'EquationRegion.group'
        db.add_column(u'allometric_equationregion', 'group',
                      self.gf('django.db.models.fields.related.ForeignKey')(to=orm['allometric.EquationGroup'], null=True),
                      keep_default=False)


    models = {
        u'allometric.equation': {
            'Meta': {'object_name': 'Equation'},
            'default': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'equationtype': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['allometric.EquationType']", 'null': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'less_or_equal': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'owner': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['auth.User']"}),
            'public': ('django.db.models.fields.BooleanField', [], {}),
            'region': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['allometric.EquationRegion']", 'null': 'True', 'blank': 'True'}),
            'species': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['allometric.EquationSpecies']", 'null': 'True', 'blank': 'True'}),
            'string': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'volumetric': ('django.db.models.fields.BooleanField', [], {'default': 'False'})
        },
        u'allometric.equationcountry': {
            'Meta': {'object_name': 'EquationCountry'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'})
        },
        u'allometric.equationregion': {
            'Meta': {'object_name': 'EquationRegion'},
            'country': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['allometric.EquationCountry']", 'null': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'})
        },
        u'allometric.equationspecies': {
            'Meta': {'object_name': 'EquationSpecies'},
            'display': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'genus': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'})
        },
        u'allometric.equationtype': {
            'Meta': {'object_name': 'EquationType'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '1'})
        },
        u'auth.group': {
            'Meta': {'object_name': 'Group'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        u'auth.permission': {
            'Meta': {'ordering': "(u'content_type__app_label', u'content_type__model', u'codename')", 'unique_together': "((u'content_type', u'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['contenttypes.ContentType']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        u'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'user_set'", 'blank': 'True', 'to': u"orm['auth.Group']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'user_set'", 'blank': 'True', 'to': u"orm['auth.Permission']"}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        u'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        }
    }

    complete_apps = ['allometric']